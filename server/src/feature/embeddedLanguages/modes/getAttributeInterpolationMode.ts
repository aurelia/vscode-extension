import { ViewRegionInfo, ViewRegionType , HTMLDocumentRegions } from '../embeddedSupport';
import { TextDocumentPositionParams } from 'vscode-languageserver';

import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import { getAureliaVirtualCompletions } from '../../completions/virtualCompletion';
import { DefinitionResult } from '../../definition/getDefinition';
import { getAccessScopeDefinition } from '../../definition/accessScopeDefinition';
import { VirtualLanguageService } from '../../virtual/virtualSourceFile';
import { getAccessScopeHover } from '../../hover/accessScopeHover';

export function getAttributeInterpolationMode(
  languageModelCacheDocument: LanguageModelCache<Promise<HTMLDocumentRegions>>
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.AttributeInterpolation;
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams
    ) {
      const aureliaVirtualCompletions = await getAureliaVirtualCompletions(
        _textDocumentPosition,
        document
      );
      if (aureliaVirtualCompletions.length > 0) {
        return aureliaVirtualCompletions;
      }

      return [];
    },
    async doDefinition(
      document: TextDocument,
      position: Position,
      goToSourceWord: string,
    ): Promise<DefinitionResult | undefined> {
      const regions = (await languageModelCacheDocument.get(document)).getRegions();
      return getAccessScopeDefinition(
        document,
        position,
        goToSourceWord,
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
