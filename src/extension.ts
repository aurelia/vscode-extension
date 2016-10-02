import { ExtensionContext, OutputChannel, window } from 'vscode';
import AureliaCliCommands from './aureliaCLICommands';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

  // Create default output channel
  outputChannel = window.createOutputChannel('aurelia');
  context.subscriptions.push(outputChannel);

  // Register CLI commands
  context.subscriptions.push(AureliaCliCommands.registerCommands(outputChannel));
}
