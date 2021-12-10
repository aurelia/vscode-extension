import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { aureliaVirtualComplete_vNext } from '../../../feature/completions/virtualCompletion2';
import { getAccessScopeDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getAccessScopeHover } from '../../../feature/hover/accessScopeHover';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { VirtualLanguageService } from '../../../feature/virtual/virtualSourceFile';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class TextInterpolationLanguageService
  implements AbstractRegionLanguageService
{
  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter?: string,
    region?: AbstractRegion,
    offset?: number,
    replaceTriggerCharacter?: boolean
  ) {
    const completions = aureliaVirtualComplete_vNext(
      aureliaProgram,
      document,
      region,
      triggerCharacter,
      offset,
    replaceTriggerCharacter
    );
    return completions;
  }

  public async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    region: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    const regions =
      aureliaProgram.aureliaComponents.getOneByFromDocument(
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

  public async doHover(
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

  public async doRename(
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
