import { CompletionParams, Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Container } from '../../../../core/container';
import { AureliaProgram } from '../../../../core/viewModel/AureliaProgram';
import { aureliaVirtualComplete_vNext } from '../../../../feature/completions/virtualCompletion2';
import { getAccessScopeViewModelDefinition } from '../../../../feature/definition/accessScopeDefinition';
import { aureliaRenameFromView } from '../../../../feature/rename/aureliaRename';
import { DefinitionResult } from '../../parser-types';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class RepeatForLanguageService implements AbstractRegionLanguageService {
  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter?: string,
    region?: AbstractRegion,
    offset?: number,
    insertTriggerCharacter?: boolean,
    completionParams?: CompletionParams
  ) {
    const completions = aureliaVirtualComplete_vNext(
      aureliaProgram,
      document,
      region,
      triggerCharacter,
      offset,
      insertTriggerCharacter,
      completionParams
    );
    return completions;
  }
  public async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    region: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    return getAccessScopeViewModelDefinition(
      document,
      position,
      region,
      aureliaProgram
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
