import * as fs from 'fs';
import { pathToFileURL } from 'url';

import { camelCase, kebabCase } from 'lodash';
import { Position, Range } from 'vscode-html-languageservice';
import { TextEdit } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  findSourceWord,
  getWordAtOffset,
} from '../../common/documens/find-source-word';
import { getRelatedFilePath } from '../../common/documens/related';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import {
  ViewRegionInfo,
  ViewRegionType,
} from '../../core/embeddedLanguages/embeddedSupport';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';
import { DocumentSettings } from '../configuration/DocumentSettings';
import {
  getViewModelPathFromTagName,
  performViewModelChanges,
  getAllChangesForOtherViews,
  renameAllOtherRegionsInSameView,
} from './workspaceEdits';

export async function aureliaRenameFromView(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  position: Position,
  newName: string,
  region: ViewRegionInfo
) {
  if (!region.startCol) return;
  if (!region.endCol) return;

  // 1. rename view model
  const offset = document.offsetAt(position);
  const sourceWord = findSourceWord(region, offset);

  let viewModelPath = '';

  // 1.1 Determine view model path
  if (region.type === ViewRegionType.BindableAttribute) {
    viewModelPath =
      getViewModelPathFromTagName(aureliaProgram, region.tagName ?? '') ?? '';
  } else {
    viewModelPath = getRelatedFilePath(UriUtils.toPath(document.uri), [
      '.js',
      '.ts',
    ]);
  }

  const viewModelChanes = performViewModelChanges(
    aureliaProgram,
    viewModelPath,
    sourceWord,
    camelCase(newName)
  );

  // 2. rename all others
  const otherCustomElementChanges = await getAllChangesForOtherViews(
    aureliaProgram,
    viewModelPath,
    sourceWord,
    kebabCase(newName)
  );
  // otherCustomElementChanges; /*?*/

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
  if (!viewDocument) return;

  const otherChangesInsideSameView = await renameAllOtherRegionsInSameView(
    aureliaProgram,
    viewDocument,
    sourceWord,
    newName
  );

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
  const viewModelPath = UriUtils.toPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return;

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return;

  // View Model
  const viewModelChanges = performViewModelChanges(
    aureliaProgram,
    viewModelPath,
    sourceWord,
    newName
  );
  // viewModelChanges; /*?*/

  // Other Views
  const otherComponentChanges = await getAllChangesForOtherViews(
    aureliaProgram,
    viewModelPath,
    sourceWord,
    kebabCase(newName)
  );
  // otherComponentChanges; /*?*/

  // Related View
  const viewExtensions = documentSettings.getSettings().relatedFiles?.view;
  if (!viewExtensions) return;

  const viewPath = getRelatedFilePath(
    UriUtils.toPath(document.uri),
    viewExtensions
  );

  const viewDocument = TextDocumentUtils.createHtmlFromPath(viewPath);
  viewDocument.getText();
  const otherChangesInsideSameView = await renameAllOtherRegionsInSameView(
    aureliaProgram,
    viewDocument,
    sourceWord,
    newName
  );
  // otherChangesInsideSameView; /*?*/

  const finalChanges = {
    changes: {
      ...viewModelChanges,
      ...otherComponentChanges,
      ...otherChangesInsideSameView,
    },
  };
  // finalChanges; /*?*/
  return finalChanges;
}
