interface IViewCompletionParam {
  document: vscode.TextDocument;
  position: vscode.Position;
  token: vscode.CancellationToken;
  context: vscode.CompletionContext;
  text: string;
  offset: number;
  triggerCharacter: string;
}

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
  CompletionParams,
 MarkedString, Position, TextDocument } from 'vscode-languageserver';

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
import * as vscode from 'vscode';
import { Uri } from 'vscode';
import { AureliaApplication } from './FileParser/Model/AureliaApplication';
import { normalizePath } from './Util/NormalizePath';
import { connect } from 'net';
import { AureliaConfigProperties } from '../client/Model/AureliaConfigProperties';
import { exposeAureliaDefinitions } from './ExposeAureliaDefinitions';
import { sys } from 'typescript';

// Bind console.log & error to the Aurelia output
const connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const documents: TextDocuments = new TextDocuments();
documents.listen(connection);

// Setup Aurelia dependency injection
const globalContainer = new Container();
const completionItemFactory = globalContainer.get(CompletionItemFactory);
const aureliaApplication = globalContainer.get(AureliaApplication);
const settings = globalContainer.get(AureliaSettings);

// Register characters to lisen for
connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {

  // TODO: find better way/place to init this
  const dummy = globalContainer.get(ElementLibrary);

  return {
    capabilities: {
      completionProvider: { resolveProvider: false, triggerCharacters: [' ', '.', '[', '"', '\'', '{', '<'] },
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
  settings.featureToggles = {
    ...settings.featureToggles,
    ...change.settings.aurelia.featureToggles,
  };
  settings.extensionSettings = {
    ...settings.extensionSettings,
    ...change.settings.aurelia.extensionSettings
  };

  await handlefeatureToggles(settings);
});

// Setup Validation
const validator = globalContainer.get(HtmlValidator);
documents.onDidChangeContent(async change => {
  const diagnostics = await validator.doValidation(change.document);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

// Lisen for completion requests
connection.onRequest('aurelia-view-completion', async (params: IViewCompletionParam) => {
  const {
    document, position, token, context, text, offset, triggerCharacter,
  } = params;
  const completionResult = await completionItemFactory.create(triggerCharacter, position, text, offset, document.uri, aureliaApplication);
  return CompletionList.create(completionResult, false);
});

connection.onCompletion(async (textDocumentPosition: CompletionParams): Promise<CompletionList> => {
  const document = documents.get(textDocumentPosition.textDocument.uri);
  const text = document.getText();
  const offset = document.offsetAt(textDocumentPosition.position);
  const triggerCharacter = text.substring(offset - 1, offset);
  const position = textDocumentPosition.position;
  const uriLike = { path: document.uri };
  const completionItem = await completionItemFactory.create(triggerCharacter, position, text, offset, uriLike, aureliaApplication);
  return CompletionList.create(completionItem, false);
});

connection.onRequest('aurelia-view-information', async (filePath: string) => {
  // let fileProcessor = new ProcessFiles();
  // await fileProcessor.processPath();
  // aureliaApplication.components = fileProcessor.components;

  return aureliaApplication.components.find(doc => doc.paths.includes(normalizePath(filePath)));
});

connection.onRequest('aurelia-definition-provide', () => {
  const { definitionsInfo, definitionsAttributesInfo } = exposeAureliaDefinitions(aureliaApplication);
  definitionsInfo;
  definitionsAttributesInfo;
  return { definitionsInfo, definitionsAttributesInfo };
});

connection.onRequest('aurelia-get-components', () => {
  const { definitionsInfo, definitionsAttributesInfo } = exposeAureliaDefinitions(aureliaApplication);
  return { definitionsInfo, definitionsAttributesInfo, aureliaApplication };
});

connection.onRequest('aurelia-smart-autocomplete-goto', () => {
  return aureliaApplication.components;
});

connection.onDefinition((position: TextDocumentPositionParams): Definition => {
  /**
   * Need to have this onDefinition here, else we get following error in the console
   * Request textDocument/definition failed.
   * Message: Unhandled method textDocument/definition
   * Code: -32601
   */
  return null;
});

connection.listen();

async function handlefeatureToggles({ featureToggles, extensionSettings }: AureliaSettings) {
  if (featureToggles.smartAutocomplete) {
    console.log('smart auto complete init');

    // Aurelia project path to parse
    console.log('>>> 1.1 This is the project\'s directory:');
    const sourceDirectory = sys.getCurrentDirectory();
    console.log(sourceDirectory);
    console.log('>>> 1.2. The extension will try to parse Aurelia components inside:');
    console.log(settings.extensionSettings.pathToAureliaProject);
    console.log('>>> 1.3. Eg.');
    console.log(`${sourceDirectory  }/${  settings.extensionSettings.pathToAureliaProject[0]}`);

    try {
      const updateAureliaComponents = async () => {
        const fileProcessor = new ProcessFiles();
        await fileProcessor.processPath(extensionSettings);
        aureliaApplication.components = fileProcessor.components;

        console.log('>>> The extension found this many components:');
        console.log(aureliaApplication.components.length);
      };

      let configPath = ts.findConfigFile(
        /* searchPath */ "./",
        ts.sys.fileExists,
        "tsconfig.json"
      );
      
      if (configPath === undefined) {
        configPath = '../../tsconfig.json' // use config file from the extension as default
      }

      // Skip watcher if no tsconfig found
      const createWatchProgram = configPath !== undefined;

      if (createWatchProgram) {
        console.log(">>> 1.4 Initiating a watcher for documentation and fetching changes in custom components");

        const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

        const host = ts.createWatchCompilerHost(
          configPath,
          {},
          ts.sys,
          createProgram,
        );

        // We hook into createProgram to enable manual update of AureliaComponents of the application
        // upon changes. We also need to call the original createProgram to fulfill the lifecycle of the host.
        const origCreateProgram = host.createProgram;
        host.createProgram = (rootNames: readonly string[], options, programHost, oldProgram) => {
          // Call update on AureliaComponents to ensure that the custom components are in sync
          updateAureliaComponents();
          return origCreateProgram(rootNames, options, programHost, oldProgram);
        };

        // We also overwrite afterProgramCreate to avoid actually running a compile towards the file system
        host.afterProgramCreate = program => {
          aureliaApplication.watcherProgram = program;
        };

        // Create initial watch program with our specially crafted host for aurelia component handling
        ts.createWatchProgram(host);
      } else {
        console.log("Not tsconfig file found. The watcher needs a working tsconfig file to");
      }

      // To avoid an extra call to the AureliaComponents mapping we check whether the host has been created
      if (!createWatchProgram) {
        await updateAureliaComponents();
      }

    } catch (ex) {
      console.log('------------- FILE PROCESSOR ERROR ---------------------');
      console.log(JSON.stringify(ex));
    }
  }
}
