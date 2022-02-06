import { Container } from 'aurelia-dependency-injection';
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

export class AttributeLanguageService implements AbstractRegionLanguageService {
  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter?: string,
    region?: AbstractRegion,
    offset?: number
  ) {
    const completions = aureliaVirtualComplete_vNext(
      aureliaProgram,
      document,
      region,
      triggerCharacter,
      offset
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

    return getAccessScopeDefinition(
      aureliaProgram,
      document,
      position,
      region,
      regions
    );
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
    container: Container,
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    newName: string,
    region: AbstractRegion
  ) {
    const renames = aureliaRenameFromView(
      container,
      aureliaProgram,
      document,
      position,
      newName,
      region
    );
    return renames;
  }
}
