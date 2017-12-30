import 'reflect-metadata';
import { createConnection, 
  IConnection, 
  TextDocuments, 
  InitializeParams, 
  InitializeResult, 
  CompletionList, Hover } from 'vscode-languageserver';
import { MarkedString } from 'vscode-languageserver-types';
import { Container } from 'aurelia-dependency-injection';
import CompletionItemFactory from './CompletionItemFactory';
import ElementLibrary from './Completions/Library/_elementLibrary';
import AureliaSettings from './AureliaSettings';

import { HtmlValidator } from './Validations/HtmlValidator';

// Bind console.log & error to the Aurelia output
let connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

// Setup Aurelia dependency injection
let globalContainer = new Container();
let completionItemFactory = <CompletionItemFactory> globalContainer.get(CompletionItemFactory);

// Register characters to lisen for
connection.onInitialize((params: InitializeParams): InitializeResult => {
  
  // TODO: find better way to init this
  let dummy = globalContainer.get(ElementLibrary);
  
  return {
    capabilities: {
      completionProvider: { resolveProvider: false, triggerCharacters: ['<', ' ', '.', '[', '"', '\''] },
      textDocumentSync: documents.syncKind,
    },
  };
});

// Register and get changes to Aurelia settings
connection.onDidChangeConfiguration(change => { 
  let settings = <AureliaSettings> globalContainer.get(AureliaSettings);
  settings.quote = change.settings.aurelia.autocomplete.quotes === 'single' ? '\'' : '"';
  settings.validation = change.settings.aurelia.validation;
  settings.bindings.data = change.settings.aurelia.autocomplete.bindings.data;
});

// Setup Validation
const validator = <HtmlValidator> globalContainer.get(HtmlValidator);
documents.onDidChangeContent(async change => {
  const diagnostics = await validator.doValidation(change.document);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

// Lisen for completion requests
connection.onCompletion(textDocumentPosition => {
  let document = documents.get(textDocumentPosition.textDocument.uri);
  let text = document.getText();
  let offset = document.offsetAt(textDocumentPosition.position);
  let triggerCharacter = text.substring(offset - 1, offset);
  let position = textDocumentPosition.position;
  return completionItemFactory.create(triggerCharacter, position, text, offset, textDocumentPosition.textDocument.uri);
});

connection.listen();
