import { createConnection, IConnection, TextDocuments, InitializeParams, InitializeResult } from 'vscode-languageserver';
import { HTMLDocument, getLanguageService } from './aurelia-languageservice/aureliaLanguageService';
import { getLanguageModelCache } from './languageModelCache';

let connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

let htmlDocuments = getLanguageModelCache<HTMLDocument>(10, 60, document => getLanguageService().parseHTMLDocument(document));
documents.onDidClose(e => {
  htmlDocuments.onDocumentRemoved(e.document);
});

connection.onShutdown(() => {
  htmlDocuments.dispose();
});

let workspacePath: string;

connection.onInitialize((params: InitializeParams): InitializeResult => {
  workspacePath = params.rootPath;
  return {
    capabilities: {
      completionProvider: { resolveProvider: false, triggerCharacters: ['.', '<'] },
      textDocumentSync: documents.syncKind,
    },
  };
});

let aureliaSettings;
connection.onDidChangeConfiguration(change => aureliaSettings = change.settings.aurelia);

let languageService = getLanguageService();

documents.onDidChangeContent(async change => {
  let htmlDocument = htmlDocuments.get(change.document);
  const diagnostics = await languageService.doValidation(change.document, htmlDocument);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

connection.onCompletion(textDocumentPosition => {
  let document = documents.get(textDocumentPosition.textDocument.uri);
  let htmlDocument = htmlDocuments.get(document);
  return languageService.doComplete(document, textDocumentPosition.position, htmlDocument, aureliaSettings.autocomplete.quotes);
});

connection.listen();
