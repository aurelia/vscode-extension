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
    /* prettier-ignore */ logger.log('Initilization started.',{logMs:true,msStart:true});

    await onConnectionInitialized(
      this.container,
      extensionSettings,
      this.allDocuments.all()
    );

    /* prettier-ignore */ logger.log('Initilization done. Aurelia Extension is ready. 🚀',{logMs:true,msEnd:true});
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
    if (this.extensionSettings.capabilities?.completions === false) return;
    /* prettier-ignore */ logger.log('Completion triggered.',{logMs:true,msStart:true});

    const completions = await onCompletion(
      this.container,
      textDocumentPosition,
      document
    );

    /* prettier-ignore */ logger.log(`Found ${completions?.length ?? 0} completion(s).`,{logMs:true,msEnd:true});
    return completions;
  }

  // onCompletionResolve() {}
  // onSignatureHelp() {}
  // onDeclaration() {}

  public async onDefinition(document: TextDocument, position: Position) {
    if (this.extensionSettings.capabilities?.definitions === false) return;
    /* prettier-ignore */ logger.log('Definition triggered.',{logMs:true,msStart:true});

    const definition = await onDefintion(document, position, this.container);

    /* prettier-ignore */ logger.log(`Found ${definition?.length ?? 0} definition(s).`,{logMs:true,msEnd:true});
    return definition;
  }

  // onTypeDefinition() {}
  // onImplementation() {}
  // onReferences() {}
  // onDocumentHighlight() {}

  public async onDocumentSymbol(documentUri: string) {
    if (this.extensionSettings.capabilities?.documentSymbols === false) return;
    /* prettier-ignore */ logger.log('Document symbol triggered.',{logMs:true,msStart:true});

    const symbols = await onDocumentSymbol(this.container, documentUri);

    /* prettier-ignore */ logger.log(`Found ${symbols?.length ?? 0} symbol(s).`,{logMs:true,msEnd:true});
    return symbols;
  }

  public onWorkspaceSymbol() {
    if (this.extensionSettings.capabilities?.workspaceSymbols === false) return;
    /* prettier-ignore */ logger.log('Workspace symbol triggered.',{logMs:true,msStart:true});

    // const symbols = onWorkspaceSymbol(this.container, query);
    const symbols = onWorkspaceSymbol(this.container);

    /* prettier-ignore */ logger.log(`Found ${symbols?.length ?? 0} symbol(s).`,{logMs:true,msEnd:true});
    return symbols;
  }

  public async onCodeAction(codeActionParams: CodeActionParams) {
    if (this.extensionSettings.capabilities?.codeActions === false) return;
    /* prettier-ignore */ logger.log('Code action triggered.',{logMs:true,msStart:true});

    const codeAction = await onCodeAction(
      this.container,
      codeActionParams,
      this.allDocuments
    );

    /* prettier-ignore */ logger.log(`Found ${codeAction?.length ?? 0} code action(s).`,{logMs:true,msEnd:true});
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
    if (this.extensionSettings.capabilities?.renames === false) return;
    /* prettier-ignore */ logger.log('Rename triggered.',{logMs:true,msStart:true});

    const renamed = await onRenameRequest(
      document,
      position,
      newName,
      this.container
    );

    /* prettier-ignore */ logger.log(`Found ${renamed?.changes?.length ?? 0} rename(s).`,{logMs:true,msEnd:true});
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
