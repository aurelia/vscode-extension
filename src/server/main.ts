import 'reflect-metadata';
import { createConnection, 
  IConnection, 
  TextDocuments, 
  InitializeParams, 
  InitializeResult, 
  CompletionList } from 'vscode-languageserver';
import { HTMLDocument, getLanguageService } from './aurelia-languageservice/aureliaLanguageService';
import { getLanguageModelCache } from './languageModelCache';
import { Container } from 'aurelia-dependency-injection';
import CompletionItemFactory from './CompletionItemFactory';

// Bind console.log & error to the Aurelia output
let connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

// Cache documents
let documents: TextDocuments = new TextDocuments();
documents.listen(connection);
let htmlDocuments = getLanguageModelCache<HTMLDocument>(10, 60, document => getLanguageService().parseHTMLDocument(document));
documents.onDidClose(e => htmlDocuments.onDocumentRemoved(e.document));
connection.onShutdown(() => htmlDocuments.dispose());

let workspacePath: string;

// Register character to lisen for
connection.onInitialize((params: InitializeParams): InitializeResult => {
  workspacePath = params.rootPath;
  return {
    capabilities: {
      completionProvider: { resolveProvider: false, triggerCharacters: ['<', ' ', '.', '[', '"', '\''] },
      textDocumentSync: documents.syncKind,
    },
  };
});

// Register and get changes to Aurelia settings
let aureliaSettings;
connection.onDidChangeConfiguration(change => aureliaSettings = change.settings.aurelia);

// Setup Validation
let languageService = getLanguageService();
documents.onDidChangeContent(async change => {
  let htmlDocument = htmlDocuments.get(change.document);
  const diagnostics = await languageService.doValidation(change.document, htmlDocument);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

// Setup Aurelia dependency injection
let globalContainer = new Container();
let factory = <CompletionItemFactory> globalContainer.get(CompletionItemFactory);

// Lisen for completion requests
connection.onCompletion(textDocumentPosition => {
  let document = documents.get(textDocumentPosition.textDocument.uri);
  let text = document.getText();
  let offset = document.offsetAt(textDocumentPosition.position);
  let triggerCharacter = text.substring(offset - 1, offset);
  let position = textDocumentPosition.position;

  return { 
    isIncomplete: false, 
    items: factory.create(triggerCharacter, position, text, offset, textDocumentPosition.textDocument.uri) 
  };
});

connection.listen();
