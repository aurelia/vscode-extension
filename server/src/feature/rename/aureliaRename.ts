import * as fs from 'fs';

import { camelCase } from 'lodash';
import { pathToFileURL } from 'url';
import { Position, Range } from 'vscode-html-languageservice';
import { TextEdit } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { findSourceWord } from '../../common/documens/find-source-word';
import { getRelatedFilePath } from '../../common/documens/related';
import { UriUtils } from '../../common/view/uri-utils';
import {
  ViewRegionInfo,
  ViewRegionType,
} from '../../core/embeddedLanguages/embeddedSupport';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';
import {
  getViewModelPathFromTagName,
  performViewModelChanges,
  getAllOtherChangesForComponentsWithBindable,
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

  const { line } = position;
  const startPosition = Position.create(line - 1, region.startCol - 1);
  const endPosition = Position.create(line - 1, region.endCol - 1);
  const range = Range.create(startPosition, endPosition);

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
  const otherComponentChanges = await getAllOtherChangesForComponentsWithBindable(
    aureliaProgram,
    sourceWord,
    newName
  );

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

  return {
    changes: {
      [document.uri]: [TextEdit.replace(range, newName)],
      ...viewModelChanes,
      ...otherComponentChanges,
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
