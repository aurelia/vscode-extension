import * as fs from 'fs';
import { pathToFileURL } from 'url';

import { camelCase } from 'lodash';
import { Range, TextEdit } from 'vscode-languageserver';

import { findSourceWord } from '../../../common/documens/find-source-word';
import { ExtensionSettings } from '../../../feature/configuration/DocumentSettings';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import { Logger } from '../../../common/logging/logger';
import {
  getViewModelPathFromTagName,
  performViewModelChanges,
  getAllOtherChangesForComponentsWithBindable,
  renameAllOtherRegionsInSameView,
} from '../../../feature/rename/workspaceEdits';

const logger = new Logger('getBindableAttributeMode');

export function getBindableAttributeMode(
  aureliaProgram: AureliaProgram,
  extensionSettings: ExtensionSettings
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.BindableAttribute;
    },

    async doRename(
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
      const viewModelPath = getViewModelPathFromTagName(
        aureliaProgram,
        region.tagName ?? ''
      )!;
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
      const componentList = aureliaProgram.aureliaComponents.get();
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
    },

    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
