import {
  DocumentSettings,
  ExtensionSettings,
} from '../configuration/DocumentSettings';
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
import { AureliaProgram } from '../viewModel/AureliaProgram';
import { onDefintion } from './definitions/on-definitions';
import { Position } from 'vscode-html-languageservice';
import { inject } from 'aurelia-dependency-injection';
import { AureliaProjectFiles } from '../common/AureliaProjectFiles';
import { initDependencyInjection } from './depdenceny-injection';

@inject(Container, DocumentSettings)
export class AureliaServer {
  constructor(
    private container: Container,
    public readonly extensionSettings: ExtensionSettings
  ) {
    initDependencyInjection(container, extensionSettings);
  }

  public getAureliaProgram(): AureliaProgram {
    const aureliaProjectFiles = this.container.get(AureliaProjectFiles);
    const { aureliaProgram } = aureliaProjectFiles.getAureliaProjects()[0];
    if (!aureliaProgram) {
      throw new Error('Need Aurelia Program');
    }

    return aureliaProgram;
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
  // onHover() {}

  async onCompletion(
    textDocumentPosition: TextDocumentPositionParams,
    document: TextDocument,
    languageModes: LanguageModes
  ) {
    const completions = await onCompletion(
      textDocumentPosition,
      document,
      languageModes,
      this.getAureliaProgram()
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
      languageModes,
      this.getAureliaProgram()
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
