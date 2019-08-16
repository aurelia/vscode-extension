import {
  ExtensionContext, 
  window as Window
} from 'vscode';
import * as path from 'path';
import { WorkspaceLoader } from './WorkspaceLoader';

export async function activate(context: ExtensionContext) {

  const channel = Window.createOutputChannel('aurelia');
  await new WorkspaceLoader(channel, context.asAbsolutePath(path.join('server', 'dist', 'server.js'))).load();
}

export function deactivate(): Thenable<void> {
  return Promise.resolve();
}
