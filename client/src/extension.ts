import {
  workspace as Workspace, 
  ExtensionContext, 
  window as Window
} from 'vscode';
import * as path from 'path';

import {
	LanguageClient, TransportKind, LanguageClientOptions, ServerOptions
} from 'vscode-languageclient';

let clients: Map<string, LanguageClient> = new Map();

export function activate(context: ExtensionContext) {

  const channel = Window.createOutputChannel('aurelia');
  channel.appendLine('checking workspaces for Aurelia workspaces');

  workspacePluginLoader(channel, context);

}

export function deactivate(): Thenable<void> {
  return Promise.resolve();
}

/**
 * Load the plugin for each seperate workspace (Proof of Concept)
 */
function workspacePluginLoader(channel, context) {
  const serverModule = context.asAbsolutePath(path.join('server', 'dist', 'server.js'));

  // Initial check of workspaces
  Workspace.workspaceFolders.forEach(async (folder) => {
    
    channel.appendLine("processing workspace: " + folder.uri.toString());

    const workspacePath = folder.uri.fsPath;   
    const packageJsonPath = path.join(workspacePath, 'package.json');
    const document = await Workspace.openTextDocument(packageJsonPath);
    let packageJson = JSON.parse(document.getText());

    // TODO: figure out if this is the right way to detect it's an Aurelia 2 workspace
    if (!packageJson.dependencies.hasOwnProperty('@aurelia/runtime')) {
      return;
    }

    channel.appendLine("activating Aurelia plugin for workspace: " + folder.uri.toString());

    const debugOptions = { execArgv: ["--nolazy", `--inspect=${6011 + clients.size}`] };
    const serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions}
    };
    const clientOptions: LanguageClientOptions = {
      documentSelector: [
        { scheme: 'file', language: 'plaintext', pattern: `${folder.uri.fsPath}/**/*` }
      ],
      diagnosticCollectionName: 'aurelia|' + workspacePath,
      workspaceFolder: folder,
      outputChannel: channel
    }

    const client = new LanguageClient('aurelia', serverOptions, clientOptions);
    client.start();
    clients.set(workspacePath, client);

  });

  Workspace.onDidChangeWorkspaceFolders((event) => {

    // add client if workspace is added
    for (let folder of event.removed) {
      channel.appendLine("workspace added :" + folder.uri.fsPath);
    }

    // remove client when workspace is removed
    for (let folder of event.removed) {
      let client = clients.get(folder.uri.fsPath);
      channel.appendLine("workspace deleted :" + folder.uri.fsPath);
			if (client) {
				clients.delete(folder.uri.toString());
				client.stop();
			}
    }
  });
}
