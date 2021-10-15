import { TextDocumentPositionParams } from 'vscode-languageserver';

import { getAureliaVirtualCompletions } from '../../../feature/completions/virtualCompletion';
import { getAccessScopeViewModelDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';

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

    async doRename(
      document: TextDocument,
      position: Position,
      newName: string,
      region: ViewRegionInfo
    ) {
      const renames = aureliaRenameFromView(
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
