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
import { MarkedString } from 'vscode-languageserver';

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
import { Uri } from 'vscode';

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
  aureliaApplication.components = fileProcessor.components

  return aureliaApplication.components.find(doc => doc.paths.indexOf(normalizePath(filePath)) > -1);
});

connection.onRequest('aurelia-definition-provide', () => {
  const result = exposeAureliaDefinitions();
  console.log("TCL: result", result)
  return result;
})

connection.onRequest('aurelia-smart-autocomplete-goto', () => {
  return aureliaApplication.components;
})

connection.onDefinition((position: TextDocumentPositionParams): Definition => {
  console.log("TCL: onDefinition")
  console.log("TCL: position", position)
  return null;
})



connection.listen();

export declare type DefinitionsInfo = {
  [name: string]: DefinitionLink;
}

function exposeAureliaDefinitions(): DefinitionsInfo {
  console.log("TCL: exposeAureliaDefinitions -> aureliaApplication.components", aureliaApplication.components)


  const definitionsInfo: DefinitionsInfo = {};
  // const definitions: LocationLink[] = [];
  // 1. For each component
  aureliaApplication.components.forEach(component => {
    if (!component.viewModel) return;

    const { viewModel } = component;
    // 1.1 Find target path
    const viewModelPath = component.paths.find(path => {
      // todo, get extension from settings
      return path.endsWith('.ts');
    });
    // const targetUri = Uri.parse(viewModelPath)
    const targetUri = `file://${ viewModelPath }`;
    const document = documents.get(targetUri);
    console.log("TCL: document", document)


    // 1.2. properties
    if (viewModel.properties) {
      viewModel.properties.forEach(property => {
        const { range } = property
        const targetRange = Range.create(range.start, range.end);

        definitionsInfo[property.name] = LocationLink.create(
          targetUri,
          targetRange,
          targetRange,
        )
      });
    }

    // 1.3. methods
    if (viewModel.methods) {
      viewModel.methods.forEach(method => {
        const { range } = method
        const targetRange = Range.create(range.start, range.end);

        definitionsInfo[method.name] = LocationLink.create(
          targetUri,
          targetRange,
          targetRange,
        )
      });
    }
  });

  const allDocs = documents.all();
  // and add them into defintions array
  return definitionsInfo;
}


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
