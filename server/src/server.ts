import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  CompletionList,
  TextDocumentChangeEvent,
  RenameParams,
  DocumentSymbolParams,
  ExecuteCommandParams,
} from 'vscode-languageserver';
import { CodeActionParams } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

// We need to import this to include reflect functionality
import 'reflect-metadata';

import { AURELIA_COMMANDS, AURELIA_COMMANDS_KEYS } from './common/constants';
import { UriUtils } from './common/view/uri-utils';
import { AureliaProjects } from './core/AureliaProjects';
import { AureliaServer } from './core/aureliaServer';
import { globalContainer } from './core/container';
import {
  ExtensionSettings,
  settingsName,
} from './feature/configuration/DocumentSettings';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
export const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
// let hasDiagnosticRelatedInformationCapability: boolean = false;

let hasServerInitialized = false;
let aureliaServer: AureliaServer;

connection.onInitialize(async (params: InitializeParams) => {
  console.log('[server.ts] 1. onInitialize');

  const capabilities = params.capabilities;

  // Does the client support the `workspace/configuration` request?
  // If not, we will fall back using global settings
  hasConfigurationCapability = !!(
    capabilities.workspace && Boolean(capabilities.workspace.configuration)
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && Boolean(capabilities.workspace.workspaceFolders)
  );
  // hasDiagnosticRelatedInformationCapability = Boolean(
  //   capabilities.textDocument?.publishDiagnostics?.relatedInformation
  // );

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client that the server supports code completion
      completionProvider: {
        resolveProvider: false,
        // eslint-disable-next-line @typescript-eslint/quotes
        triggerCharacters: [' ', '.', '[', '"', "'", '{', '<', ':', '|'],
      },
      definitionProvider: true,
      // hoverProvider: true,
      codeActionProvider: true,
      renameProvider: true,
      documentSymbolProvider: true,
      workspaceSymbolProvider: true,
      executeCommandProvider: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        commands: AURELIA_COMMANDS,
      },
    },
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }

  return result;
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
connection.onInitialized(async () => {
  console.log('[server.ts] 2. onInitialized');

  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    void connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined
    );

    const workspaceFolders = await connection.workspace.getWorkspaceFolders();
    if (workspaceFolders === null) return;

    const workspaceRootUri = workspaceFolders[0].uri;
    const extensionSettings = (await connection.workspace.getConfiguration({
      section: settingsName,
    })) as ExtensionSettings;

    extensionSettings.aureliaProject = {
      rootDirectory: workspaceRootUri,
    };

    aureliaServer = new AureliaServer(globalContainer, extensionSettings);
    await aureliaServer.onConnectionInitialized(
      extensionSettings,
      documents.all()
    );

    const tsConfigPath = UriUtils.toPath(workspaceRootUri);
    const aureliaProjects = globalContainer.get(AureliaProjects);
    const targetProject = aureliaProjects.getBy(tsConfigPath);
    if (!targetProject) return;

    hasServerInitialized = true;
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

connection.onDidChangeConfiguration(() => {
  console.log('[server.ts] onDidChangeConfiguration');

  // if (hasConfigurationCapability) {
  //   // Reset all cached document settings
  //   documentSettings.settingsMap.clear();
  // } else {
  //   documentSettings.globalSettings = (change.settings[settingsName] ||
  //     documentSettings.defaultSettings) as ExtensionSettings;
  // }

  // void createAureliaWatchProgram(aureliaProgram);
});

// connection.onDidOpenTextDocument(() => {});

// Only keep settings for open documents
// documents.onDidClose((e) => {
//   documentSettings.settingsMap.delete(e.document.uri);
// });

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
// documents.onDidChangeContent(
//   async (change: TextDocumentChangeEvent<TextDocument>) => {
//     if (!hasServerInitialized) return;
//     await aureliaServer.onConnectionDidChangeContent(change);
//   }
// );

documents.onDidSave(async (change: TextDocumentChangeEvent<TextDocument>) => {
  await aureliaServer.onDidSave(change);
});

connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
  async (
    _textDocumentPosition: TextDocumentPositionParams
  ): Promise<CompletionItem[] | CompletionList> => {
    const documentUri = _textDocumentPosition.textDocument.uri;
    const document = documents.get(documentUri);
    if (!document) {
      throw new Error('No document found');
    }

    const completions = await aureliaServer.onCompletion(
      document,
      _textDocumentPosition
    );

    return completions;
  }
);

// This handler resolves additional information for the item selected in
// the completion list.
// connection.onCompletionResolve(
//   (item: CompletionItem): CompletionItem => {
//     return item;
//   }
// );

connection.onDefinition(
  async ({ position, textDocument }: TextDocumentPositionParams) => {
    const documentUri = textDocument.uri.toString();
    const document = documents.get(documentUri); // <
    if (!document) return null;

    const definition = await aureliaServer.onDefinition(document, position);

    if (definition) {
      return definition;
    }

    return null;
  }
);

connection.onDocumentSymbol(async (params: DocumentSymbolParams) => {
  if (hasServerInitialized === false) return;
  const symbols = await aureliaServer.onDocumentSymbol(params.textDocument.uri);
  return symbols;
});
// connection.onWorkspaceSymbol(async (params: WorkspaceSymbolParams) => {
connection.onWorkspaceSymbol(async () => {
  if (hasServerInitialized === false) return;
  // const workspaceSymbols = aureliaServer.onWorkspaceSymbol(params.query);
  const workspaceSymbols = aureliaServer.onWorkspaceSymbol();
  return workspaceSymbols;
});

// connection.onHover(
//   async ({ position, textDocument }: TextDocumentPositionParams) => {
//     const documentUri = textDocument.uri.toString();
//     const document = documents.get(documentUri); // <
//     if (!document) return null;

//     const hovered = await aureliaServer.onHover(
//       document.getText(),
//       position,
//       documentUri,
//     );

//     return hovered;
//   }
// );

connection.onCodeAction(async (codeActionParams: CodeActionParams) => {
  const codeAction = await aureliaServer.onCodeAction(codeActionParams);

  if (codeAction) {
    return codeAction;
  }
});

connection.onExecuteCommand(
  async (executeCommandParams: ExecuteCommandParams) => {
    const command = executeCommandParams.command as AURELIA_COMMANDS_KEYS;
    switch (command) {
      case 'extension.au.reinitializeExtension': {
        const workspaceFolders =
          await connection.workspace.getWorkspaceFolders();
        if (workspaceFolders === null) return;

        const workspaceRootUri = workspaceFolders[0].uri;
        const extensionSettings = (await connection.workspace.getConfiguration({
          section: settingsName,
        })) as ExtensionSettings;

        extensionSettings.aureliaProject = {
          rootDirectory: workspaceRootUri,
        };

        aureliaServer = new AureliaServer(globalContainer, extensionSettings);
        await aureliaServer.onConnectionInitialized(
          extensionSettings,
          documents.all()
        );

        break;
      }
      default: {
        // console.log('no command');
      }
    }
    // async () => {
    return null;
  }
);

connection.onRenameRequest(
  async ({ position, textDocument, newName }: RenameParams) => {
    const documentUri = textDocument.uri;
    const document = documents.get(documentUri);
    if (!document) {
      throw new Error('No document found');
    }
    const renamed = await aureliaServer.onRenameRequest(
      document,
      position,
      newName
    );

    if (renamed) {
      return renamed;
    }
  }
);

// connection.onPrepareRename(async (prepareRename: PrepareRenameParams) => {
//   /* prettier-ignore */ console.log('TCL: prepareRename', prepareRename);
//   return new ResponseError(0, 'failed');
// });

connection.onRequest('aurelia-get-component-list', () => {
  const aureliaProjects = globalContainer.get(AureliaProjects);
  // TODO: use .getBy instead of getAll
  const { aureliaProgram } = aureliaProjects.getAll()[0];

  if (!aureliaProgram) return;

  return aureliaProgram.aureliaComponents.getAll().map((cList) => {
    const {
      componentName,
      className,
      viewFilePath,
      viewModelFilePath,
      baseViewModelFileName,
    } = cList;
    return {
      componentName,
      className,
      viewFilePath,
      viewModelFilePath,
      baseViewModelFileName,
    };
  });
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
