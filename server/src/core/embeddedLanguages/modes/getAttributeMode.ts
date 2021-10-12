import { TextDocumentPositionParams } from 'vscode-languageserver';

import { getAureliaVirtualCompletions } from '../../../feature/completions/virtualCompletion';
import { getAccessScopeDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getAccessScopeHover } from '../../../feature/hover/accessScopeHover';
import { VirtualLanguageService } from '../../../feature/virtual/virtualSourceFile';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
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
