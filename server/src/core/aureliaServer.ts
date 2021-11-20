import { Position } from 'vscode-html-languageservice';
import {
  Connection,
  PublishDiagnosticsParams,
  TextDocumentChangeEvent,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver';
import { CodeActionParams, Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SymbolInformation } from 'vscode-languageserver-types';
import { Logger } from '../common/logging/logger';

import { onCodeAction } from '../feature/codeAction/onCodeAction';
import { onCompletion } from '../feature/completions/onCompletions';
import { ExtensionSettings } from '../feature/configuration/DocumentSettings';
import { onConnectionDidChangeContent } from '../feature/content/changeContent';
import { onDefintion } from '../feature/definition/onDefinitions';
import { createDiagnostics } from '../feature/diagnostics/diagnostics';
import { onConnectionInitialized } from '../feature/initialization/initialization';
import { onRenameRequest } from '../feature/rename/onRenameRequest';
import { onDidSave } from '../feature/save/saveContent';
import { onDocumentSymbol } from '../feature/symbols/onDocumentSymbol';
import { onWorkspaceSymbol } from '../feature/symbols/onWorkspaceSymbol';
import { Container } from './container';
import { initDependencyInjection } from './depdencenyInjection';

const logger = new Logger('AureliaServer');

export class AureliaServer {
  constructor(
    private readonly container: Container,
    public readonly extensionSettings: ExtensionSettings,
    public allDocuments: TextDocuments<TextDocument>
  ) {
    initDependencyInjection(container, extensionSettings);
  }

  public async onConnectionInitialized(
    extensionSettings: ExtensionSettings
  ): Promise<void> {
    await onConnectionInitialized(
      this.container,
      extensionSettings,
      this.allDocuments.all()
    );
  }

  public async onConnectionDidChangeContent(
    change: TextDocumentChangeEvent<TextDocument>
  ): Promise<void> {
    await onConnectionDidChangeContent(this.container, change);
  }

  // listen() {}
  // onRequest() {}
  // sendRequest() {}
  // onNotification() {}
  // sendNotification() {}
  // // onProgress() {}
  // sendProgress() {}
  // onInitialize() {}
  // onInitialized() {}
  // onShutdown() {}
  // onExit() {}
  // onDidChangeConfiguration() {}
  // onDidChangeWatchedFiles() {}
  // onDidOpenTextDocument() {}
  // onDidChangeTextDocument() {}
  // onDidCloseTextDocument() {}
  // onWillSaveTextDocument() {}
  // onWillSaveTextDocumentWaitUntil() {}

  public async onDidSave(change: TextDocumentChangeEvent<TextDocument>) {
    await onDidSave(this.container, change);
  }

  sendDiagnostics(document: TextDocument) {
    const diagnostics = createDiagnostics(this.container, document);

    const diagnosticsParams: PublishDiagnosticsParams = {
      uri: document.uri,
      diagnostics,
    };
    return diagnosticsParams;
  }

  public async onHover() {
    // filePath: string // position: Position, // documentContent: string,
    // const hovered = onHover(documentContent, position, filePath);
    // return hovered;
  }

  public async onCompletion(
    document: TextDocument,
    textDocumentPosition: TextDocumentPositionParams
  ) {
    const completions = await onCompletion(
      this.container,
      textDocumentPosition,
      document
    );

    logger.log(`Found ${completions?.length ?? 0} completion(s).`);
    return completions;
  }

  // onCompletionResolve() {}
  // onSignatureHelp() {}
  // onDeclaration() {}

  public async onDefinition(document: TextDocument, position: Position) {
    const definition = await onDefintion(document, position, this.container);

    logger.log(`Found ${definition?.length ?? 0} definition(s).`);
    return definition;
  }

  // onTypeDefinition() {}
  // onImplementation() {}
  // onReferences() {}
  // onDocumentHighlight() {}

  public async onDocumentSymbol(documentUri: string) {
    const symbols = await onDocumentSymbol(this.container, documentUri);

    logger.log(`Found ${symbols?.length ?? 0} symbol(s).`);
    return symbols;
  }

  public onWorkspaceSymbol(): SymbolInformation[] {
    // const symbols = onWorkspaceSymbol(this.container, query);
    const symbols = onWorkspaceSymbol(this.container);

    logger.log(`Found ${symbols?.length ?? 0} symbol(s).`);
    return symbols;
  }

  public async onCodeAction(codeActionParams: CodeActionParams) {
    const codeAction = await onCodeAction(
      this.container,
      codeActionParams,
      this.allDocuments
    );

    logger.log(`Found ${codeAction?.length ?? 0} code action(s).`);
    return codeAction;
  }

  // onCodeLens() {}
  // onCodeLensResolve() {}
  // onDocumentFormatting() {}
  // onDocumentRangeFormatting() {}
  // onDocumentOnTypeFormatting() {}

  public async onRenameRequest(
    document: TextDocument,
    position: Position,
    newName: string
  ) {
    const renamed = await onRenameRequest(
      document,
      position,
      newName,
      this.container
    );

    logger.log(`Found ${renamed?.changes?.length ?? 0} code action(s).`);
    return renamed;
  }

  // onPrepareRename() {}
  // onDocumentLinks() {}
  // onDocumentLinkResolve() {}
  // onDocumentColor() {}
  // onColorPresentation() {}
  // onFoldingRanges() {}
  // onSelectionRanges() {}

  // public async onExecuteCommand(executeCommandParams: ExecuteCommandParams) {
  //   onExecuteCommand(this.container, executeCommandParams);
  // }

  // dispose() {}

  // console: RemoteConsole & PConsole;
  // tracer: Tracer & PTracer;
  // telemetry: Telemetry & PTelemetry;
  // client: RemoteClient & PClient;
  // window: RemoteWindow & PWindow;
  // workspace: RemoteWorkspace & PWorkspace;
  // languages: Languages & PLanguages;
  // console;
  // tracer;
  // telemetry;
  // client;
  // window;
  // workspace;
  // languages;
}
