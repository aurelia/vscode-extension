import { AsyncReturnType } from './common/global.d';
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
  Definition,
  TextDocumentChangeEvent,
} from 'vscode-languageserver';

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  getLanguageModes,
  LanguageModes,
} from './feature/embeddedLanguages/languageModes';

// We need to import this to include reflect functionality
import 'reflect-metadata';

import {
  DocumentSettings,
  ExtensionSettings,
  settingsName,
} from './configuration/DocumentSettings';
import { aureliaProgram } from './viewModel/AureliaProgram';
import { createAureliaWatchProgram } from './viewModel/createAureliaWatchProgram';

import { DefinitionResult } from './feature/definition/getDefinition';
import { CustomHover } from './feature/virtual/virtualSourceFile';
import {
  AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER,
  AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER,
} from './common/constants';
import { checkInsideTag } from './common/view/document-parsing';
import {
  createAureliaTemplateAttributeCompletions,
  createAureliaTemplateAttributeKeywordCompletions,
} from './feature/completions/createAureliaTemplateAttributeCompletions';
import { globalContainer } from './container';
import {
  AureliaServer,
  onConnectionDidChangeContent,
  onConnectionInitialized,
} from './core/aureliaServer';

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

connection.onInitialize(async (params: InitializeParams) => {
  console.log('[server.ts] 1. onInitialize');

  const capabilities = params.capabilities;
  languageModes = await getLanguageModes();

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
      hoverProvider: true,
    },
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }

  // Injections
  // documentSettings.inject(connection, hasConfigurationCapability);

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

    const aureliaServer = new AureliaServer(globalContainer);
    aureliaServer.onConnectionInitialized(extensionSettings, documents.all());
    // await onConnectionInitialized(
    //   globalContainer,
    //   workspaceRootUri,
    //   extensionSettings,
    //   documents.all()
    // );
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
documents.onDidChangeContent(
  async (change: TextDocumentChangeEvent<TextDocument>) => {
    await onConnectionDidChangeContent(change);
  }
);

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
      return [];
    }
    const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
      document,
      _textDocumentPosition.position
    );

    if (!modeAndRegion) return [];
    const { mode } = modeAndRegion;

    if (!mode) return [];

    const doComplete = mode.doComplete!;
    const text = document.getText();
    const offset = document.offsetAt(_textDocumentPosition.position);
    const triggerCharacter = text.substring(offset - 1, offset);
    let accumulateCompletions: CompletionItem[] = [];

    if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER) {
      const isNotRegion = modeAndRegion.region === undefined;
      const isInsideTag = await checkInsideTag(document, offset);
      if (isNotRegion && isInsideTag) {
        const atakCompletions = createAureliaTemplateAttributeKeywordCompletions();
        return atakCompletions;
      }
    } else if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER) {
      let ataCompletions: CompletionItem[];
      const isNotRegion = modeAndRegion.region === undefined;
      const isInsideTag = await checkInsideTag(document, offset);

      if (isInsideTag) {
        ataCompletions = createAureliaTemplateAttributeCompletions();

        if (isNotRegion) {
          return ataCompletions;
        }

        accumulateCompletions = ataCompletions;
      }
    }

    if (doComplete !== undefined) {
      let completions: CompletionItem[] = [CompletionItem.create('')];
      try {
        completions = ((await doComplete(
          document,
          _textDocumentPosition,
          triggerCharacter,
          modeAndRegion.region
        )) as unknown) as CompletionItem[];
      } catch (error) {
        console.log('TCL: error', error);
      }

      accumulateCompletions.push(...completions);
      return accumulateCompletions;
    }

    return [];
  }
);

// This handler resolves additional information for the item selected in
// the completion list.
// connection.onCompletionResolve(
//   (item: CompletionItem): CompletionItem => {
//     return item;
//   }
// );

connection.onDefinition((_: TextDocumentPositionParams): Definition | null => {
  /**
   * Need to have this onDefinition here, else we get following error in the console
   * Request textDocument/definition failed.
   * Message: Unhandled method textDocument/definition
   * Code: -32601
   */
  return null;
});

connection.onHover(() => {
  return null;
});

connection.onRequest('aurelia-get-component-list', () => {
  return aureliaProgram.getComponentList().map((cList) => {
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

connection.onRequest<any, any>(
  'get-virtual-definition',
  async ({
    documentContent,
    position,
    goToSourceWord,
    filePath,
  }): Promise<DefinitionResult | undefined> => {
    const document = TextDocument.create(filePath, 'html', 0, documentContent);
    const isRefactor = true;

    let modeAndRegion: AsyncReturnType<
      LanguageModes['getModeAndRegionAtPosition']
    >;
    try {
      modeAndRegion = await languageModes.getModeAndRegionAtPosition(
        document,
        position
      );
    } catch (error) {
      console.log('TCL: error', error);
    }

    if (!modeAndRegion) return;
    const { mode, region } = modeAndRegion;

    if (!mode) return;

    const doDefinition = mode.doDefinition!;

    if (doDefinition !== undefined && isRefactor) {
      let definitions: AsyncReturnType<typeof doDefinition>;

      try {
        definitions = await doDefinition(
          document,
          position,
          goToSourceWord,
          region
        );
      } catch (error) {
        console.log('TCL: error', error);
        return;
      }
      return definitions;
    }

    console.log('---------------------------------------');
    console.log('---------------------------------------');
    console.log('---------------------------------------');
    console.log('---------------------------------------');
    console.log('LEGACY DEFINITON');
    console.log('---------------------------------------');
    console.log('---------------------------------------');
    console.log('---------------------------------------');
    console.log('---------------------------------------');
  }
);
connection.onRequest<any, any>(
  'get-virtual-hover',
  async ({
    documentContent,
    position,
    goToSourceWord,
    filePath,
  }): Promise<CustomHover | undefined> => {
    const document = TextDocument.create(filePath, 'html', 0, documentContent);
    const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
      document,
      position
    );

    if (!modeAndRegion) return;
    const { mode, region } = modeAndRegion;

    if (!mode) return;
    if (!region) return;

    const doHover = mode.doHover;

    if (doHover) {
      let hoverResult: AsyncReturnType<typeof doHover>;

      try {
        hoverResult = await doHover(document, position, goToSourceWord, region);
      } catch (error) {
        console.log('TCL: error', error);
        return;
      }
      return hoverResult;
    }
  }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
