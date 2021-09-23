import {
  ViewRegionInfo,
  ViewRegionType,
  HTMLDocumentRegions,
} from '../embeddedSupport';
import { TextDocumentPositionParams } from 'vscode-languageserver';

import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import { getAureliaVirtualCompletions } from '../../completions/virtualCompletion';
import { DefinitionResult } from '../../definition/getDefinition';
import { AureliaProgram } from '../../../viewModel/AureliaProgram';
import { getAccessScopeDefinition } from '../../definition/accessScopeDefinition';
import { VirtualLanguageService } from '../../virtual/virtualSourceFile';
import { getAccessScopeHover } from '../../hover/accessScopeHover';

export function getTextInterpolationMode(
  aureliaProgram: AureliaProgram,
  languageModelCacheDocument: LanguageModelCache<Promise<HTMLDocumentRegions>>
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.TextInterpolation;
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter?: string,
      region?: ViewRegionInfo
    ) {
      if (!region) return [];

      const aureliaVirtualCompletions = await getAureliaVirtualCompletions(
        _textDocumentPosition,
        document,
        region,
        aureliaProgram
      );
      if (aureliaVirtualCompletions.length > 0) {
        return aureliaVirtualCompletions;
      }

      return [];
    },

    async doDefinition(
      document: TextDocument,
      position: Position,
      region: ViewRegionInfo
    ): Promise<DefinitionResult | undefined> {
      const regions = (
        await languageModelCacheDocument.get(document)
      ).getRegions();
      const definition = getAccessScopeDefinition(
        aureliaProgram,
        document,
        position,
        region,
        regions
      );
      return definition;
    },

    async doHover(
      document: TextDocument,
      position: Position,
      goToSourceWord: string,
      attributeRegion: ViewRegionInfo
    ): Promise<ReturnType<VirtualLanguageService['getQuickInfoAtPosition']>> {
      return getAccessScopeHover(
        aureliaProgram,
        document,
        position,
        goToSourceWord,
        attributeRegion
      );
    },
    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
