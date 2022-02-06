import { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { aureliaVirtualComplete_vNext } from '../../../feature/completions/virtualCompletion2';
import { getAccessScopeViewModelDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { Container } from '../../container';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class RepeatForLanguageService implements AbstractRegionLanguageService {
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
