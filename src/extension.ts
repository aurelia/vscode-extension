import { ExtensionContext, OutputChannel, window, languages } from 'vscode';
import AureliaCliCommands from './aureliaCLICommands';
import AurerliaHtmlCompletionProvider from './aurerliaHtmlCompletionProvider';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

  // Create default output channel
  outputChannel = window.createOutputChannel('aurelia');
  context.subscriptions.push(outputChannel);

  // Register CLI commands
  context.subscriptions.push(AureliaCliCommands.registerCommands(outputChannel));

  // Register completion
  context.subscriptions.push(languages.registerCompletionItemProvider('html', new AurerliaHtmlCompletionProvider() , '.'));
}
