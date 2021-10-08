import { Position } from 'vscode-html-languageservice';
import {
  RenameParams,
  TextDocumentChangeEvent,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { ExtensionSettings } from '../feature/configuration/DocumentSettings';
import { Container } from './container';
import { onCompletion } from '../feature/completions/on-completions';
import { onConnectionDidChangeContent } from '../feature/content/change-content';
import { initDependencyInjection } from './depdenceny-injection';
import { onConnectionInitialized } from '../feature/initialization/initialization';
import { onRenameRequest } from '../feature/rename/on-rename-request';
import { onDefintion } from '../feature/definition/on-definitions';
import { onHover } from '../feature/hover/on-hover';
import { LanguageModes } from './embeddedLanguages/languageModes';

export class AureliaServer {
  constructor(
    private readonly container: Container,
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

  async onRenameRequest(
    position: Position,
    document: TextDocument,
    newName: string,
    languageModes: LanguageModes
  ) {
    const renamed = await onRenameRequest(
      position,
      document,
      newName,
      languageModes,
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
