import * as path from 'path';
import * as vscode from 'vscode';
import {
  ExtensionContext,
  OutputChannel,
  window,
  languages,
  SnippetString,
  commands,
  TextEdit,
  LocationLink,
  Uri
} from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';
import { RelatedFiles } from './relatedFiles';
import { registerPreview } from './Preview/Register';
import { TextDocumentContentProvider } from './Preview/TextDocumentContentProvider';
import { WebComponent } from '../server/FileParser/Model/WebComponent';
import { getFileNameAsKebabCase } from '../Util/GetFileNameAsKebabCase';
// import { TextDocuments } from 'vscode-languageserver';

let outputChannel: OutputChannel;

class GoDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken): Thenable<vscode.DefinitionLink[]> {
    return new Promise((resolve, reject) => {
      let defs = [];
      for (let i = 0; i < document.lineCount; i++) {
        // Go through each line of the document
        let line = document.lineAt(i);

				/**
				 * TODO: why need `toLowerCase` here?
				 */
        let lineText = line.text.toLowerCase().trim();

				/**
				 * Fill `defs` array with content
				 * In this case, every line which starts with cursor
				 */
        if (lineText.startsWith('cursor')) {
          defs.push({
            targetUri: document.uri,
            targetRange: line.range
          });
        }
      }
      console.log('defs', defs);
      resolve(defs);
    });

  }
}

class SearchDefinitionInView implements vscode.DefinitionProvider {
  client: LanguageClient;

  // documents: TextDocuments = new TextDocuments();

  constructor (client: LanguageClient) {
    this.client = client;
  }

  public async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken): Promise<vscode.DefinitionLink[]> {

    // let provider = new TextDocumentContentProvider(this.client);
    // const content = await provider.provideTextDocumentContent(document.uri);
    const { activeTextEditor } = vscode.window
    const components = await this.client.sendRequest<any[]>('aurelia-smart-autocomplete-goto');
    console.log("TCL: SearchDefinitionInView -> components", components)


    // 1. get value name (property or method) CHECK
    const goToSourceWordRange = document.getWordRangeAtPosition(position);
    const goToSourceWord = document.getText(goToSourceWordRange);
    console.log("TCL: SearchDefinitionInView -> goToSourceWord", goToSourceWord)

    // 2. file name of sourceFile to look for definition in viewModel first
    const fileName = getFileNameAsKebabCase(document.fileName);
    console.log("TCL: SearchDefinitionInView -> fileName", fileName)

    const testgoToComponent = components.find(component => component.name === fileName);
    console.log("TCL: SearchDefinitionInView -> testgoToComponent", testgoToComponent)

    const targetProperty = testgoToComponent.viewModel.properties.find(property => {
      return property.name === goToSourceWord;
    })
    const testgoToRange = targetProperty.range;

    // 3. Find target path
    const viewModelPath = testgoToComponent.paths.find(path => {
      // todo, get extension from settings
      return path.endsWith('.ts');
    });
    const path = `file://${ viewModelPath }`;
    console.log("TCL: SearchDefinitionInView -> path", path)
    const targetUri = Uri.parse(path)
    console.log("TCL: SearchDefinitionInView -> targetUri", targetUri)


    // 4. need target document to get the correct position
    const targetDocument = document;

    const newStartPosition = targetDocument.positionAt(testgoToRange.start.character);
    const newEndPosition = targetDocument.positionAt(testgoToRange.end.character);
    const rangeOfTargetText = new vscode.Range(
      newStartPosition,
      newEndPosition
    );

    // compare with components

    // find way to link to component
    //  for that need line number

    return new Promise((resolve, reject) => {
      let definitions = [];
      definitions.push({
        targetUri: Uri.parse(path),
        targetRange: rangeOfTargetText,
      });
      console.log("TCL: SearchDefinitionInView -> definitions", definitions)
      resolve(definitions);
    });
  }
}

class SearchDefinitionInViewV2 implements vscode.DefinitionProvider {
  client: LanguageClient;

  // documents: TextDocuments = new TextDocuments();

  constructor (client: LanguageClient) {
    this.client = client;
  }

  public async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position): Promise<vscode.DefinitionLink[]> {
    const definitionsInfo = await this.client.sendRequest('aurelia-definition-provide');

    // 1. get value name (property or method) CHECK
    const goToSourceWordRange = document.getWordRangeAtPosition(position);
    const goToSourceWord = document.getText(goToSourceWordRange);

    definitionsInfo[goToSourceWord].targetUri = Uri.parse(
      definitionsInfo[goToSourceWord].targetUri
    )
    console.log("TCL: SearchDefinitionInViewV2 -> definitionsInfo[goToSourceWord]", definitionsInfo[goToSourceWord])
    return definitionsInfo[goToSourceWord];
  }
}

export function activate(context: ExtensionContext) {


  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
    { scheme: 'file', language: 'plaintext' },
    new GoDefinitionProvider())
  );
  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
    { scheme: 'file', language: 'typescript' },
    new GoDefinitionProvider())
  );



  // Create default output channel
  outputChannel = window.createOutputChannel('aurelia');
  context.subscriptions.push(outputChannel);


  // Register CLI commands
  context.subscriptions.push(AureliaCliCommands.registerCommands(outputChannel));
  context.subscriptions.push(new RelatedFiles());

  // Register Code Actions
  const edit = (uri: string, documentVersion: number, edits: TextEdit[]) => {
    let textEditor = window.activeTextEditor;
    if (textEditor && textEditor.document.uri.toString() === uri) {
      textEditor.edit(mutator => {
        for (let edit of edits) {
          mutator.replace(client.protocol2CodeConverter.asRange(edit.range), edit.newText);
        }
      }).then((success) => {
        window.activeTextEditor.document.save();
        if (!success) {
          window.showErrorMessage('Failed to apply Aurelia code fixes to the document. Please consider opening an issue with steps to reproduce.');
        }
      });
    }
  };
  context.subscriptions.push(commands.registerCommand('aurelia-attribute-invalid-case', edit));
  context.subscriptions.push(commands.registerCommand('aurelia-binding-one-way-deprecated', edit));

  // Register Aurelia language server
  const serverModule = context.asAbsolutePath(path.join('dist', 'src', 'server', 'main.js'));
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6100'] };
  const serverOptions: ServerOptions = {
    debug: { module: serverModule, options: debugOptions, transport: TransportKind.ipc },
    run: { module: serverModule, transport: TransportKind.ipc },
  };

  const clientOptions: LanguageClientOptions = {
    diagnosticCollectionName: 'Aurelia',
    documentSelector: ['html'],
    initializationOptions: {},
    synchronize: {
      configurationSection: ['aurelia'],
    },
  };

  const client = new LanguageClient('html', 'Aurelia', serverOptions, clientOptions);
  registerPreview(context, window, client);

  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
    { scheme: 'file', language: 'html' },
    new SearchDefinitionInViewV2(client))
  );

  const disposable = client.start();
  context.subscriptions.push(disposable);
}
