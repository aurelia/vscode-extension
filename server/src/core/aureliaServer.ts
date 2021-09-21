import { ExtensionSettings } from '../configuration/DocumentSettings';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  TextDocumentChangeEvent,
  TextDocumentPositionParams,
} from 'vscode-languageserver';
import { Container } from '../container';
import { onConnectionInitialized } from './initialization/initialization';
import { onConnectionDidChangeContent } from './content/change-content';
import { LanguageModes } from '../feature/embeddedLanguages/languageModes';
import { onCompletion } from './completions/on-completions';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../viewModel/AureliaProgram';

export class AureliaServer {
  constructor(private container: Container) {}

  async onConnectionInitialized(
    extensionSettings: ExtensionSettings,
    activeDocuments: TextDocument[] = []
  ): Promise<void> {
    await onConnectionInitialized(
      this.container,
      extensionSettings,
      activeDocuments
    );
  }

  async onConnectionDidChangeContent(
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
  // onDidSaveTextDocument() {}
  // sendDiagnostics() {}
  // onHover() {}

  async onCompletion(
    textDocumentPosition: TextDocumentPositionParams,
    document: TextDocument,
    languageModes: LanguageModes,
    aureliaProgram: AureliaProgram = importedAureliaProgram
  ) {
    const completions = onCompletion(
      textDocumentPosition,
      document,
      languageModes,
      aureliaProgram
    );

    return completions;
  }

  // onCompletionResolve() {}
  // onSignatureHelp() {}
  // onDeclaration() {}
  // onDefinition() {}
  // onTypeDefinition() {}
  // onImplementation() {}
  // onReferences() {}
  // onDocumentHighlight() {}
  // onDocumentSymbol() {}
  // onWorkspaceSymbol() {}
  // onCodeAction() {}
  // onCodeLens() {}
  // onCodeLensResolve() {}
  // onDocumentFormatting() {}
  // onDocumentRangeFormatting() {}
  // onDocumentOnTypeFormatting() {}
  // onRenameRequest() {}
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
