import { Range, TextDocumentEdit, TextEdit } from 'vscode-languageserver';

import { AureliaProgram } from '../../../viewModel/AureliaProgram';
import {
  ViewRegionInfo,
  ViewRegionType,
  HTMLDocumentRegions,
} from '../embeddedSupport';
import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode, Position, TextDocument } from '../languageModes';

export function getBindableAttributeMode(
  aureliaProgram: AureliaProgram,
  languageModelCacheDocument: LanguageModelCache<Promise<HTMLDocumentRegions>>
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
      const startPosition = Position.create(line, region.startCol - 1);
      const endPosition = Position.create(line, region.endCol - 1);
      const range = Range.create(startPosition, endPosition);

      return {
        // changes: {
        //   [document.uri]: [TextEdit.replace(range, newName)],
        // },
        documentChanges: [
          TextDocumentEdit.create(
            { version: document.version + 1, uri: document.uri },
            [TextEdit.replace(range, newName)]
          ),
        ],
      };
    },

    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
