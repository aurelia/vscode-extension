import { DefinitionInfo } from 'typescript';
import * as path from 'path';
import {
  ExtensionContext,
  OutputChannel,
  window,
  languages,
  SnippetString,
  commands,
  TextEdit,
  LocationLink,
  Uri,
  DefinitionProvider,
  TextDocument,
  Position,
  DefinitionLink,
} from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';
import { RelatedFiles } from './relatedFiles';
import { registerPreview } from './Preview/Register';
import { TextDocumentContentProvider } from './Preview/TextDocumentContentProvider';
import { WebComponent } from '../server/FileParser/Model/WebComponent';
import { getFileNameAsKebabCase } from '../Util/GetFileNameAsKebabCase';
import { DefinitionsInfo, DefinitionsAttributesInfo } from '../server/ExposeAureliaDefinitions';

let outputChannel: OutputChannel;

class SearchDefinitionInViewV2 implements DefinitionProvider {
  client: LanguageClient;

  constructor(client: LanguageClient) {
    this.client = client;
  }

  public async provideDefinition(
    document: TextDocument,
    position: Position): Promise<DefinitionLink[]> {
    const { definitionsInfo, definitionsAttributesInfo } = await this.client.sendRequest<{
      definitionsInfo: DefinitionsInfo, definitionsAttributesInfo: DefinitionsAttributesInfo,
    }>('aurelia-definition-provide');

    const goToSourceWordRange = document.getWordRangeAtPosition(position);
    const goToSourceWord = document.getText(goToSourceWordRange);

    const foundDefinitions = definitionsInfo[goToSourceWord];
    const getFileName = (path: string): string => {
      return path.split('/').pop().replace(/\..+/, '');
    }
    const currentFileName = getFileName(document.fileName);
    const possibleDefs = foundDefinitions.filter(foundDef => {
      const isCustomElement = getFileName(foundDef.targetUri) === goToSourceWord;
      const isViewModelVariable = getFileName(foundDef.targetUri) === currentFileName; // eg. `.bind="viewModelVariable"`
      const isBindingAttribute = definitionsAttributesInfo[goToSourceWord] // eg. `binding-attribute.bind="..."`

      return isCustomElement || isViewModelVariable || isBindingAttribute;
    });

    let targetDef;
    if (possibleDefs.length === 1) {
      targetDef = possibleDefs[0];
    } else {
      targetDef = possibleDefs.find(possibleDef => {
        const attrInfos = definitionsAttributesInfo[goToSourceWord] // eg. `binding-attribute.bind="..."`
        const isBindingAttribute = attrInfos[0].customElementName === getFileName(possibleDef.targetUri);
        return isBindingAttribute;
      });
    }

    return {
      ...targetDef,
      targetUri: Uri.parse(targetDef.targetUri)
    }
  }
}

export function activate(context: ExtensionContext) {
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

  context.subscriptions.push(languages.registerDefinitionProvider(
    { scheme: 'file', language: 'html' },
    new SearchDefinitionInViewV2(client))
  );

  const disposable = client.start();
  context.subscriptions.push(disposable);
}
