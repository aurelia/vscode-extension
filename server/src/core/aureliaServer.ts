import { Position } from 'vscode-html-languageservice';
import {
  TextDocumentChangeEvent,
  TextDocumentPositionParams,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SymbolInformation } from 'vscode-languageserver-types';

import { onCompletion } from '../feature/completions/onCompletions';
import { ExtensionSettings } from '../feature/configuration/DocumentSettings';
import { onConnectionDidChangeContent } from '../feature/content/changeContent';
import { onDefintion } from '../feature/definition/onDefinitions';
import { onConnectionInitialized } from '../feature/initialization/initialization';
import { onRenameRequest } from '../feature/rename/onRenameRequest';
import { onDidSave } from '../feature/save/saveContent';
import { onDocumentSymbol } from '../feature/symbols/onDocumentSymbol';
import { onWorkspaceSymbol } from '../feature/symbols/onWorkspaceSymbol';
import { Container } from './container';
import { initDependencyInjection } from './depdencenyInjection';

export class AureliaServer {
  constructor(
    private readonly container: Container,
    public readonly extensionSettings: ExtensionSettings
  ) {
    initDependencyInjection(container, extensionSettings);
  }

  public async onConnectionInitialized(
    extensionSettings: ExtensionSettings,
    activeDocuments: TextDocument[] = []
  ): Promise<void> {
    await onConnectionInitialized(
      this.container,
      extensionSettings,
      activeDocuments
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

  // sendDiagnostics() {}
  public async onHover(
    // documentContent: string,
    // position: Position,
    // filePath: string
  ) {
    // const hovered = onHover(documentContent, position, filePath);
    // return hovered;
  }

  public async onCompletion(
    textDocumentPosition: TextDocumentPositionParams,
    document: TextDocument
  ) {
    const completions = await onCompletion(
      this.container,
      textDocumentPosition,
      document
    );

    return completions;
  }

  // onCompletionResolve() {}
  // onSignatureHelp() {}
  // onDeclaration() {}

  public async onDefinition(document: TextDocument, position: Position) {
    const definition = await onDefintion(document, position, this.container);
    return definition;
  }

  // onTypeDefinition() {}
  // onImplementation() {}
  // onReferences() {}
  // onDocumentHighlight() {}

  public async onDocumentSymbol(documentUri: string) {
    const symbols = await onDocumentSymbol(this.container, documentUri);
    return symbols;
  }

  public onWorkspaceSymbol(): SymbolInformation[] {
    // const symbols = onWorkspaceSymbol(this.container, query);
    const symbols = onWorkspaceSymbol(this.container);

    return symbols;
  }

  // onCodeAction() {}
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
    return renamed;
  }

  // onPrepareRename() {}
  // onDocumentLinks() {}
  // onDocumentLinkResolve() {}
  // onDocumentColor() {}
  // onColorPresentation() {}
  // onFoldingRanges() {}
  // onSelectionRanges() {}
  // onExecuteCommand() {}
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
