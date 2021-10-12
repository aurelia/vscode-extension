import { TextDocumentPositionParams } from 'vscode-languageserver';

import { getAureliaVirtualCompletions } from '../../../feature/completions/virtualCompletion';
import { getAccessScopeDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getAccessScopeHover } from '../../../feature/hover/accessScopeHover';
import { aureliaRename } from '../../../feature/rename/aureliaRename';
import { VirtualLanguageService } from '../../../feature/virtual/virtualSourceFile';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import {
  ViewRegionInfo,
  ViewRegionType,
  HTMLDocumentRegions,
} from '../embeddedSupport';
import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode, Position, TextDocument } from '../languageModes';

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

    async doRename(
      document: TextDocument,
      position: Position,
      newName: string,
      region: ViewRegionInfo
    ) {
      const renames = aureliaRename(
        aureliaProgram,
        document,
        position,
        newName,
        region
      );
      return renames;
    },

    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
