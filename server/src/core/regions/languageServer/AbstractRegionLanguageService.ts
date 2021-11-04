import {
  Diagnostic,
  TextDocumentPositionParams,
  CompletionList,
  Position,
  WorkspaceEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaCompletionItem } from '../../../feature/completions/virtualCompletion';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { CustomHover } from '../../../feature/virtual/virtualSourceFile';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';

export interface AbstractRegionLanguageService {
  doValidation?(
    aureliaProgram: AureliaProgram,
    document: TextDocument
  ): Promise<Diagnostic[]>;
  doComplete?: (
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    _textDocumentPosition: TextDocumentPositionParams,
    triggerCharacter?: string,
    region?: AbstractRegion
  ) => Promise<CompletionList | AureliaCompletionItem[]>;
  doDefinition?: (
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    region: AbstractRegion
  ) => Promise<DefinitionResult | undefined>;
  doHover?: (
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    goToSourceWord: string,
    region: AbstractRegion
  ) => Promise<CustomHover | undefined>;
  doRename?: (
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    newName: string,
    region: AbstractRegion
  ) => Promise<WorkspaceEdit | undefined>;
}
