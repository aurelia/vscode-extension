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
  WorkspaceSymbolParams,
  Range,
  CodeActionParams,
  CodeAction,
  Command,
  ExecuteCommandParams,
  WorkspaceEdit,
  Position,
  CodeActionKind,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

// We need to import this to include reflect functionality
import 'reflect-metadata';

import { AureliaProjects } from './core/AureliaProjects';
import { AureliaServer } from './core/aureliaServer';
import { globalContainer } from './core/container';
import {
  DocumentSymbol,
  getLanguageModes,
  LanguageModes,
  SymbolInformation,
  SymbolKind,
} from './core/embeddedLanguages/languageModes';
import {
  ExtensionSettings,
  settingsName,
} from './feature/configuration/DocumentSettings';
import { UriUtils } from './common/view/uri-utils';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
export const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
let languageModes: LanguageModes;

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

let hasServerInitialized = false;
let aureliaServer: AureliaServer;

connection.onInitialize(async (params: InitializeParams) => {
  console.log('[server.ts] 1. onInitialize');

  const capabilities = params.capabilities;

  // Does the client support the `workspace/configuration` request?
  // If not, we will fall back using global settings
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client that the server supports code completion
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: [' ', '.', '[', '"', "'", '{', '<', ':', '|'],
      },
      definitionProvider: true,
      // hoverProvider: true,
      codeActionProvider: true,
      renameProvider: true,
      documentSymbolProvider: true,
      workspaceSymbolProvider: true,
      executeCommandProvider: { commands: ['extension.au.refactor.component'] },
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
    const { aureliaProgram } = targetProject;

    if (aureliaProgram) {
      languageModes = await getLanguageModes(aureliaProgram, extensionSettings);
    }

    hasServerInitialized = true;
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

connection.onDidChangeConfiguration((change) => {
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

connection.onDidOpenTextDocument((param) => {
  param;
  /* prettier-ignore */ console.log('TCL: param', param);
});

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
      _textDocumentPosition,
      document,
      languageModes
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

    const definition = await aureliaServer.onDefinition(
      document,
      position,
      languageModes
    );

    if (definition) {
      return definition;
    }

    return null;
  }
);

connection.onDocumentSymbol(async (params: DocumentSymbolParams) => {
  /* prettier-ignore */ console.log('TCL: params', params)

  const symbols = await aureliaServer.onDocumentSymbol(params.textDocument.uri);
  return symbols;
});
connection.onWorkspaceSymbol(async (params: WorkspaceSymbolParams) => {
  /* prettier-ignore */ console.log('TCL: params', params)
  const workspaceSymbols = aureliaServer.onWorkspaceSymbol(params.query);
  return workspaceSymbols;
});

connection.onHover(
  async ({ position, textDocument }: TextDocumentPositionParams) => {
    const documentUri = textDocument.uri.toString();
    const document = documents.get(documentUri); // <
    if (!document) return null;

    const hovered = await aureliaServer.onHover(
      document.getText(),
      position,
      documentUri,
      languageModes
    );

    return hovered;
  }
);

connection.onCodeAction(async (codeActionParams: CodeActionParams) => {
  /* prettier-ignore */ console.log('TCL: codeActionParams', codeActionParams)
  const kind = 'extension.au.refactor.component';
  const codeAcion = CodeAction.create('Au: Create component', kind);
  codeAcion.command = Command.create('Au: Command <<', kind, ['test-arg']);
  const uri = UriUtils.toUri(
    '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/scoped-for-testing/src/view/custom-element/other-custom-element-user.html'
  );
  const position = Position.create(0, 5);
  const range = Range.create(position, position);
  codeAcion.edit = {
    changes: {
      [uri]: [{ newText: 'hello', range }],
    },
  };
  return [codeAcion];
});

connection.onExecuteCommand(
  async (executeCommandParams: ExecuteCommandParams) => {
    executeCommandParams;
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
      newName,
      languageModes
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
