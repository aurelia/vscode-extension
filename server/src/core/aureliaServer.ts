import * as fastGlob from 'fast-glob';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { normalize } from 'path';
import { AureliaExtension } from '../common/AureliaExtension';
import {
  ExtensionSettings,
  DocumentSettings,
} from '../configuration/DocumentSettings';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { Container, globalContainer } from '../container';
import { uriToPath } from '../common/uriToPath';

export class AureliaServer {
  constructor(private container: Container) {}

  async onConnectionInitialized(
    workspaceRootUri: string,
    extensionSettings: ExtensionSettings,
    activeDocuments: TextDocument[] = []
  ): Promise<void> {
    await onConnectionInitialized(
      this.container,
      workspaceRootUri,
      extensionSettings,
      activeDocuments
    );
  }

  async onConnectionDidChangeContent(
    change: TextDocumentChangeEvent<TextDocument>
  ): Promise<void> {
    await onConnectionDidChangeContent(this.container, change);
  }

  listen() {}
  onRequest() {}
  sendRequest() {}
  onNotification() {}
  sendNotification() {}
  // onProgress() {}
  sendProgress() {}
  onInitialize() {}
  onInitialized() {}
  onShutdown() {}
  onExit() {}
  onDidChangeConfiguration() {}
  onDidChangeWatchedFiles() {}
  onDidOpenTextDocument() {}
  onDidChangeTextDocument() {}
  onDidCloseTextDocument() {}
  onWillSaveTextDocument() {}
  onWillSaveTextDocumentWaitUntil() {}
  onDidSaveTextDocument() {}
  sendDiagnostics() {}
  onHover() {}
  onCompletion() {}
  onCompletionResolve() {}
  onSignatureHelp() {}
  onDeclaration() {}
  onDefinition() {}
  onTypeDefinition() {}
  onImplementation() {}
  onReferences() {}
  onDocumentHighlight() {}
  onDocumentSymbol() {}
  onWorkspaceSymbol() {}
  onCodeAction() {}
  onCodeLens() {}
  onCodeLensResolve() {}
  onDocumentFormatting() {}
  onDocumentRangeFormatting() {}
  onDocumentOnTypeFormatting() {}
  onRenameRequest() {}
  onPrepareRename() {}
  onDocumentLinks() {}
  onDocumentLinkResolve() {}
  onDocumentColor() {}
  onColorPresentation() {}
  onFoldingRanges() {}
  onSelectionRanges() {}
  onExecuteCommand() {}
  dispose() {}

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

export function initDependencyInjection(
  container: Container,
  extensionSettings: ExtensionSettings
) {
  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(AureliaExtension, new AureliaExtension(settings));
}

/**
 * 1. Init DI
 * 2. Detect Aurelia project
 * 3. Hydrate Project map
 */
export async function onConnectionInitialized(
  container: Container,
  workspaceRootUri: string,
  extensionSettings: ExtensionSettings,
  activeDocuments: TextDocument[] = []
) {
  /*  */
  initDependencyInjection(container, extensionSettings);

  const aureliaExtension = container.get(AureliaExtension);

  /*  */
  const cwd = fileURLToPath(normalize(workspaceRootUri));
  const packageJsonPaths = await fastGlob('**/package.json', {
    absolute: true,
    ignore: ['node_modules'],
    cwd,
  });

  await aureliaExtension.setAureliaProjectList(packageJsonPaths);

  const aureliaProjectList = aureliaExtension.getAureliaProjectList();
  const hasAureliaProject = aureliaProjectList.length > 0;

  if (!hasAureliaProject) {
    console.log('[INFO][server.ts] No active Aurelia project found.');
    console.log(
      '[INFO][server.ts] Extension will activate, as soon as a file inside an Aurelia project is opened.'
    );
    return;
  }

  console.log(
    `[INFO][server.ts] Found ${aureliaProjectList.length} Aurelia projects in: `
  );
  aureliaProjectList.forEach(({ tsConfigPath }) => {
    console.log(tsConfigPath);
  });

  const activeDocumentPaths = activeDocuments.map((activeDocument) => {
    const documentPath = fileURLToPath(path.normalize(activeDocument.uri));
    return documentPath;
  });
  activeDocumentPaths; /* ? */

  /*  */
  console.log('[INFO][server.ts] Parsing Aurelia related data...');
  await aureliaExtension.hydrateAureliaProjectList(activeDocumentPaths);
}

export async function onConnectionDidChangeContent(
  container: Container,
  change: TextDocumentChangeEvent<TextDocument>
) {
  switch (change.document.languageId) {
    case 'typescript': {
      const aureliaExtension = container.get(AureliaExtension);
      const documentPaths = uriToPath([change.document]);
      aureliaExtension.hydrateAureliaProjectList(documentPaths);

      // updateAureliaComponents(aureliaProgram);
    }
  }

  // console.log('TCL: change', change)
  // console.log('[server.ts] (re-)get Language Modes');
  // languageModes = await getLanguageModes();
}
