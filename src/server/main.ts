import 'reflect-metadata';
import { createConnection, 
  IConnection, 
  TextDocuments, 
  InitializeParams, 
  InitializeResult, 
  CompletionList, 
  Hover, 
  InitializedParams } from 'vscode-languageserver';
import { MarkedString } from 'vscode-languageserver-types';
import { Container } from 'aurelia-dependency-injection';
import CompletionItemFactory from './CompletionItemFactory';
import ElementLibrary from './Completions/Library/_elementLibrary';
import AureliaSettings from './AureliaSettings';

import ProcessFiles from './FileParser/ProcessFiles';

import { HtmlValidator } from './Validations/HtmlValidator';
import { HtmlInvalidCaseCodeAction } from './CodeActions/HtmlInvalidCaseCodeAction';
import { OneWayBindingDeprecatedCodeAction } from './CodeActions/OneWayBindingDeprecatedCodeAction';

import * as ts from 'typescript';
import { AureliaApplication } from './FileParser/Model/AureliaApplication';
import { normalizePath } from './Util/NormalizePath';
import { connect } from 'net';

// Bind console.log & error to the Aurelia output
const connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const documents: TextDocuments = new TextDocuments();
documents.listen(connection);

// Setup Aurelia dependency injection
const globalContainer = new Container();
const completionItemFactory = <CompletionItemFactory> globalContainer.get(CompletionItemFactory);
const aureliaApplication = <AureliaApplication> globalContainer.get(AureliaApplication);
const settings = <AureliaSettings> globalContainer.get(AureliaSettings);

// Register characters to lisen for
connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
  
  // TODO: find better way/place to init this
  const dummy = globalContainer.get(ElementLibrary);
  
  return {
    capabilities: {
      completionProvider: { resolveProvider: false, triggerCharacters: ['<', ' ', '.', '[', '"', '\''] },
      codeActionProvider: true,
      textDocumentSync: documents.syncKind,
    },
  };
});

const codeActions = [
  new HtmlInvalidCaseCodeAction(),
  new OneWayBindingDeprecatedCodeAction()
];
connection.onCodeAction(async codeActionParams => {
  const diagnostics = codeActionParams.context.diagnostics;
  const document = documents.get(codeActionParams.textDocument.uri);
  const commands = []; 
  for (const diagnostic of diagnostics) {
    const action = codeActions.find(i => i.name == diagnostic.code);
    if (action) {
      commands.push(await action.commands(diagnostic, document));
    }
  }
  return commands;
});

// Register and get changes to Aurelia settings
connection.onDidChangeConfiguration(async (change) => { 
  settings.quote = change.settings.aurelia.autocomplete.quotes === 'single' ? '\'' : '"';
  settings.validation = change.settings.aurelia.validation;
  settings.bindings.data = change.settings.aurelia.autocomplete.bindings.data;
  settings.featureToggles = change.settings.aurelia.featureToggles;

  await featureToggles(settings.featureToggles);
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



connection.onRequest('aurelia-view-information', (filePath: string) => {
  return aureliaApplication.components.find(doc => doc.paths.indexOf(normalizePath(filePath)) > -1);
});

connection.listen();


async function featureToggles(featureToggles) {
  if (settings.featureToggles.smartAutocomplete) {
    console.log('smart auto complete init');
    try {
      let fileProcessor = new ProcessFiles();
      await fileProcessor.processPath();
      aureliaApplication.components = fileProcessor.components;
    } catch (ex) {
      console.log('------------- FILE PROCESSOR ERROR ---------------------');
      console.log(JSON.stringify(ex));
    }
  }
}
