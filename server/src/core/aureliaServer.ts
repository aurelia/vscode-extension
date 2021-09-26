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
import { onDefintion } from './definitions/on-definitions';
import { Position } from 'vscode-html-languageservice';
import { initDependencyInjection } from './depdenceny-injection';
import { onHover } from './hover/on-hover';

export class AureliaServer {
  constructor(
    private container: Container,
    public readonly extensionSettings: ExtensionSettings
  ) {
    initDependencyInjection(container, extensionSettings);
  }

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
  async onHover(
    documentContent: string,
    position: Position,
    filePath: string,
    languageModes: LanguageModes
  ) {
    const hovered = onHover(documentContent, position, filePath, languageModes);
    return hovered;
  }

  async onCompletion(
    textDocumentPosition: TextDocumentPositionParams,
    document: TextDocument,
    languageModes: LanguageModes
  ) {
    const completions = await onCompletion(
      textDocumentPosition,
      document,
      languageModes
    );

    return completions;
  }

  // onCompletionResolve() {}
  // onSignatureHelp() {}
  // onDeclaration() {}

  async onDefinition(
    documentContent: string,
    position: Position,
    filePath: string,
    languageModes: LanguageModes
  ) {
    const definition = await onDefintion(
      documentContent,
      position,
      filePath,
      languageModes
    );
    return definition;
  }

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
