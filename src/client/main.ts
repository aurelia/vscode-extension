import * as path from 'path';
import { ExtensionContext, OutputChannel, window, languages, SnippetString, commands, TextEdit } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';
import { RelatedFiles } from './relatedFiles';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

  // Create default output channel
  outputChannel = window.createOutputChannel('aurelia');
  context.subscriptions.push(outputChannel);

  // Register CLI commands
  context.subscriptions.push(AureliaCliCommands.registerCommands(outputChannel));
  context.subscriptions.push(new RelatedFiles());

  // Register Code Actions
  const edit = (uri: string, documentVersion: number, edits: TextEdit[]) =>
  {
    let textEditor = window.activeTextEditor;
    if (textEditor && textEditor.document.uri.toString() === uri) {
      textEditor.edit(mutator => {
        for(let edit of edits) {
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
  const debugOptions = { execArgv: ['--nolazy', '--debug=6100'] };
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
  const disposable = client.start();
  context.subscriptions.push(disposable);
}
