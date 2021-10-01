import { Range } from 'vscode-languageserver';

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
      /* prettier-ignore */ console.log('TCL: region', region)
      if (!region.startCol) return;
      if (!region.endCol) return;

      const { line } = position;
      const startPosition = Position.create(line, region.startCol);
      const endPosition = Position.create(line, region.endCol);
      const range = Range.create(startPosition, endPosition);

      return {
        changes: {
          [document.uri]: [{ range, newText: newName }],
        },
      };
    },

    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
