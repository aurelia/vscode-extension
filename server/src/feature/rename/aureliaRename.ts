import * as fs from 'fs';
import { pathToFileURL } from 'url';

import { camelCase, kebabCase } from 'lodash';
import { Position } from 'vscode-html-languageservice';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProgram } from '../../aot/AureliaProgram';
import { AbstractRegion, ViewRegionType } from '../../aot/parser/regions/ViewRegions';
import {
  findSourceWord,
  getWordAtOffset,
} from '../../common/documens/find-source-word';
import { getRelatedFilePath } from '../../common/documens/related';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { DocumentSettings } from '../../configuration/DocumentSettings';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import {
  getViewModelPathFromTagName,
  performViewModelChanges,
  getAllChangesForOtherViews,
  renameAllOtherRegionsInSameView,
} from './workspaceEdits';

export async function aureliaRenameFromView(
  container: Container,
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  position: Position,
  newName: string,
  region: AbstractRegion
) {
  if (region.sourceCodeLocation === undefined) return;

  // 1. rename view model
  const offset = document.offsetAt(position);
  // offset; /* ? */
  const sourceWord = findSourceWord(region, offset);
  // sourceWord; /* ? */

  let viewModelPath = '';

  // 1.1 Determine view model path
  if (region.type === ViewRegionType.BindableAttribute) {
    viewModelPath =
      getViewModelPathFromTagName(aureliaProgram, region.tagName ?? '') ?? '';
  } else {
    viewModelPath = getRelatedFilePath(UriUtils.toSysPath(document.uri), [
      '.js',
      '.ts',
    ]);
  }

  const viewModelChanes = performViewModelChanges(
    container,
    aureliaProgram,
    viewModelPath,
    camelCase(sourceWord), // vars can be kebab from eg. view rename
    camelCase(newName)
  );

  // 2. rename all others
  const otherCustomElementChanges = await getAllChangesForOtherViews(
    aureliaProgram,
    viewModelPath,
    sourceWord,
    kebabCase(newName)
  );
  // otherCustomElementChanges; /* ? */

  // 3. rename all regions in view of target custom element
  // 3.1 Get document of corresponding view
  const componentList = aureliaProgram.aureliaComponents.getAll();
  const targetComponent = componentList.find(
    (component) => component.viewModelFilePath === viewModelPath
  );
  if (!targetComponent) return;

  const viewFilePath = targetComponent.viewFilePath ?? '';
  const uri = pathToFileURL(viewFilePath).toString();
  const content = fs.readFileSync(viewFilePath, 'utf-8');
  const viewDocument = TextDocument.create(uri, 'html', 0, content);
  if (viewDocument === undefined) return;

  const otherChangesInsideSameView = await renameAllOtherRegionsInSameView(
    aureliaProgram,
    viewDocument,
    sourceWord,
    newName
  );
  // otherChangesInsideSameView;/* ? */

  // const { line } = position;
  // const startPosition = Position.create(line - 1, region.startCol - 1);
  // const endPosition = Position.create(line - 1, region.endCol - 1);
  // const range = Range.create(startPosition, endPosition);

  return {
    changes: {
      // [document.uri]: [TextEdit.replace(range, newName)],
      ...viewModelChanes,
      ...otherCustomElementChanges,
      ...otherChangesInsideSameView,
    },

    // documentChanges: [
    //   TextDocumentEdit.create(
    //     { version: document.version + 1, uri: document.uri },
    //     [TextEdit.replace(range, newName)]
    //   ),
    // ],
  };
}

/**
 * console.log('TODO: Check for bindable decorator [ISSUE-cjMoQgGT]');
 *
 * Rename "from View model" behaves differently, than rename "from View",
 * because in the "from View" version, we check for Regions in the View.
 */
export async function aureliaRenameFromViewModel(
  container: Container,
  documentSettings: DocumentSettings,
  document: TextDocument,
  position: Position,
  newName: string
) {
  const offset = document.offsetAt(position);
  const sourceWord = getWordAtOffset(document.getText(), offset);
  const viewModelPath = UriUtils.toSysPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return;

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return;

  // View Model
  const viewModelChanges = performViewModelChanges(
    container,
    aureliaProgram,
    viewModelPath,
    sourceWord,
    newName
  );
  // viewModelChanges; /*?*/

  // Other Views
  const otherComponentViewChanges = await getAllChangesForOtherViews(
    aureliaProgram,
    viewModelPath,
    sourceWord,
    kebabCase(newName)
  );

  // Related View
  const viewExtensions = documentSettings.getSettings().relatedFiles?.view;
  if (!viewExtensions) return;

  const viewPath = getRelatedFilePath(
    UriUtils.toSysPath(document.uri),
    viewExtensions
  );

  const viewDocument = TextDocumentUtils.createHtmlFromPath(viewPath);
  if (!viewDocument) return;

  const otherChangesInsideSameView = await renameAllOtherRegionsInSameView(
    aureliaProgram,
    viewDocument,
    sourceWord,
    newName
  );
  // otherChangesInsideSameView; /* ? */

  const finalChanges = {
    changes: {
      ...viewModelChanges,
      ...otherComponentViewChanges,
      ...otherChangesInsideSameView,
    },
  };
  // finalChanges; /*?*/
  return finalChanges;
}
