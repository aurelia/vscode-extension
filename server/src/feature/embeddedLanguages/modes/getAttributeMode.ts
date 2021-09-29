import { TextDocumentPositionParams } from 'vscode-languageserver';

import { AureliaProgram } from '../../../viewModel/AureliaProgram';
import { getAureliaVirtualCompletions } from '../../completions/virtualCompletion';
import { getAccessScopeDefinition } from '../../definition/accessScopeDefinition';
import { DefinitionResult } from '../../definition/getDefinition';
import { getAccessScopeHover } from '../../hover/accessScopeHover';
import { VirtualLanguageService } from '../../virtual/virtualSourceFile';
import {
  ViewRegionInfo,
  ViewRegionType,
  HTMLDocumentRegions,
} from '../embeddedSupport';
import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode, Position, TextDocument } from '../languageModes';

export function getAttributeMode(
  aureliaProgram: AureliaProgram,
  languageModelCacheDocument: LanguageModelCache<Promise<HTMLDocumentRegions>>
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.Attribute;
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
      return aureliaVirtualCompletions;
    },

    async doDefinition(
      document: TextDocument,
      position: Position,
      region: ViewRegionInfo
    ): Promise<DefinitionResult | undefined> {
      const regions = (
        await languageModelCacheDocument.get(document)
      ).getRegions();
      return getAccessScopeDefinition(
        aureliaProgram,
        document,
        position,
        region,
        regions
      );
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
