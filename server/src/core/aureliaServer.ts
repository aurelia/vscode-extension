import { Logger } from 'culog';
import * as fastGlob from 'fast-glob';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { normalize } from 'path';
import {
  AureliaProject,
  AureliaProjectFiles,
} from '../common/AureliaProjectFiles';
import {
  ExtensionSettings,
  DocumentSettings,
} from '../configuration/DocumentSettings';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { Container } from '../container';
import { uriToPath } from '../common/uriToPath';

const logger = new Logger({ scope: 'aureliaServer'});

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
  container.registerInstance(
    AureliaProjectFiles,
    new AureliaProjectFiles(settings)
  );
}

/**
 * 1. Init DI
 * 2. Detect Aurelia project
 * 3. Hydrate Project map
 */
export async function onConnectionInitialized(
  container: Container,
  extensionSettings: ExtensionSettings,
  activeDocuments: TextDocument[] = []
) {
  /*  */
  initDependencyInjection(container, extensionSettings);

  /*  */
  const packageJsonPaths = getPackageJsonPaths(extensionSettings);
  const aureliaProjectFiles = container.get(AureliaProjectFiles);
  await aureliaProjectFiles.setAureliaProjects(packageJsonPaths);
  const aureliaProjects = aureliaProjectFiles.getAureliaProjects();
  const hasAureliaProject = aureliaProjects.length > 0;

  if (!hasAureliaProject) {
    logHasNoAureliaProject();
    return;
  }
  logFoundAureliaProjects(aureliaProjects);

  /*  */
  logger.debug(['Parsing Aurelia related data...'], { logLevel: 'INFO' });
  const activeDocumentPaths = activeDocuments.map((activeDocument) => {
    const documentPath = fileURLToPath(path.normalize(activeDocument.uri));
    return documentPath;
  });
  await aureliaProjectFiles.hydrateAureliaProjectList(activeDocumentPaths);
}

function logFoundAureliaProjects(aureliaProjects: AureliaProject[]) {
  logger.debug([`Found ${aureliaProjects.length} Aurelia projects in: `], {
    logLevel: 'INFO',
  });
  aureliaProjects.forEach(({ tsConfigPath }) => {
    logger.debug([tsConfigPath], {
      logLevel: 'INFO',
    });
  });
}

function logHasNoAureliaProject() {
  logger.debug(['No active Aurelia project found.'], { logLevel: 'INFO' });
  logger.debug(
    [
      'Extension will activate, as soon as a file inside an Aurelia project is opened.',
    ],
    { logLevel: 'INFO' }
  );
}

function getPackageJsonPaths(extensionSettings: ExtensionSettings) {
  const workspaceRootUri =
    extensionSettings.aureliaProject?.rootDirectory ?? '';
  const cwd = fileURLToPath(normalize(workspaceRootUri));
  const packageJsonPaths = fastGlob.sync('**/package.json', {
    absolute: true,
    ignore: ['node_modules'],
    cwd,
  });
  return packageJsonPaths;
}

export async function onConnectionDidChangeContent(
  container: Container,
  change: TextDocumentChangeEvent<TextDocument>
) {
  switch (change.document.languageId) {
    case 'typescript': {
      const aureliaProjectFiles = container.get(AureliaProjectFiles);
      const documentPaths = uriToPath([change.document]);
      aureliaProjectFiles.hydrateAureliaProjectList(documentPaths);

      // updateAureliaComponents(aureliaProgram);
    }
  }

  // console.log('TCL: change', change)
  // console.log('[server.ts] (re-)get Language Modes');
  // languageModes = await getLanguageModes();
}
