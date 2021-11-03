import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { getAureliaVirtualCompletions } from '../../../feature/completions/virtualCompletion';
import { getAccessScopeDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getAccessScopeHover } from '../../../feature/hover/accessScopeHover';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { VirtualLanguageService } from '../../../feature/virtual/virtualSourceFile';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class TextInterpolationLanguageService
  implements AbstractRegionLanguageService {
  async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    _textDocumentPosition: TextDocumentPositionParams,
    triggerCharacter?: string,
    region?: AbstractRegion
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
  }

  async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    region: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    const regions = aureliaProgram.aureliaComponents.getOneByFromDocument(
      document
    )?.viewRegions;
    const definition = getAccessScopeDefinition(
      aureliaProgram,
      document,
      position,
      region,
      regions
    );
    return definition;
  }

  async doHover(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    goToSourceWord: string,
    attributeRegion: AbstractRegion
  ): Promise<ReturnType<VirtualLanguageService['getQuickInfoAtPosition']>> {
    return getAccessScopeHover(
      aureliaProgram,
      document,
      position,
      goToSourceWord,
      attributeRegion
    );
  }

  async doRename(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    newName: string,
    region: AbstractRegion
  ) {
    const renames = aureliaRenameFromView(
      aureliaProgram,
      document,
      position,
      newName,
      region
    );
    return renames;
  }
}
