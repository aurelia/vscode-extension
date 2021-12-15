import {
  Diagnostic,
  TextDocumentPositionParams,
  CompletionList,
  Position,
  WorkspaceEdit,
  CodeAction,
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
  doCodeAction?(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    start: Position,
    region?: AbstractRegion
  ): Promise<CodeAction[]>;
  doComplete?: (
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter?: string,
    region?: AbstractRegion,
    offset?: number,
    /**
     * TODO: Clarify need for this one.
     * This was introduced when introducing TriggerKind (eg. invoked).
     * We need to handle the previous trigger character depending on
     * 1. Triggered (invoked)
     * 2. On typed
     *
     * for 2. the trigger character is substring from offset - 1.
     */
    insertTriggerCharacter?: boolean,
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
