import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { getAureliaVirtualCompletions } from '../../../feature/completions/virtualCompletion';
import { getAccessScopeViewModelDefinition } from '../../../feature/definition/accessScopeDefinition';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class RepeatForLanguageService implements AbstractRegionLanguageService {
  public async doComplete(
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
