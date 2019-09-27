import 'reflect-metadata';
import {
  createConnection,
  IConnection,
  TextDocuments,
  InitializeParams,
  InitializeResult,
  Hover,
  CompletionList,
  InitializedParams,
  TextDocumentPositionParams,
  Definition,
  DocumentLinkParams,
  DocumentLink,
  CodeLensParams,
  CodeLens,
  ReferenceParams,
  Location,
  DefinitionLink,
  LocationLink,
  Range,
} from 'vscode-languageserver';
import { MarkedString, Position } from 'vscode-languageserver';

import { camelCase } from 'aurelia-binding';
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
import { AureliaConfigProperties } from '../client/Model/AureliaConfigProperties';
import { exposeAureliaDefinitions } from './ExposeAureliaDefinitions';

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
      definitionProvider: true,
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
connection.onCompletion(async (textDocumentPosition) => {
  let document = documents.get(textDocumentPosition.textDocument.uri);
  let text = document.getText();
  let offset = document.offsetAt(textDocumentPosition.position);
  let triggerCharacter = text.substring(offset - 1, offset);
  let position = textDocumentPosition.position;
  return CompletionList.create(await completionItemFactory.create(triggerCharacter, position, text, offset, textDocumentPosition.textDocument.uri), false);
});


connection.onRequest('aurelia-view-information', async (filePath: string) => {
  let fileProcessor = new ProcessFiles();
  await fileProcessor.processPath();
  aureliaApplication.components = fileProcessor.components;

  return aureliaApplication.components.find(doc => doc.paths.indexOf(normalizePath(filePath)) > -1);
});

connection.onRequest('aurelia-definition-provide', () => {
  const { definitionsInfo, definitionsAttributesInfo } = exposeAureliaDefinitions(aureliaApplication);
  definitionsInfo
  definitionsAttributesInfo
  return { definitionsInfo, definitionsAttributesInfo };
})

connection.onRequest('aurelia-smart-autocomplete-goto', () => {
  return aureliaApplication.components;
})

connection.onDefinition((position: TextDocumentPositionParams): Definition => {
  /**
   * Need to have this onDefinition here, else we get following error in the console
   * Request textDocument/definition failed.
   * Message: Unhandled method textDocument/definition
   * Code: -32601
   */
  return null;
})

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
