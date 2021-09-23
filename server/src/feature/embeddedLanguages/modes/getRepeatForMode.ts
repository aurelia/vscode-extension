import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { TextDocumentPositionParams } from 'vscode-languageserver';

import { LanguageMode, Position, TextDocument } from '../languageModes';
import { getAureliaVirtualCompletions } from '../../completions/virtualCompletion';
import { getAccessScopeViewModelDefinition } from '../../definition/accessScopeDefinition';
import { DefinitionResult } from '../../definition/getDefinition';
import { AureliaProgram } from '../../../viewModel/AureliaProgram';

export function getRepeatForMode(aureliaProgram: AureliaProgram): LanguageMode {
  return {
    getId() {
      return ViewRegionType.RepeatFor;
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
      return getAccessScopeViewModelDefinition(
        document,
        position,
        region,
        aureliaProgram
      );
    },
    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
