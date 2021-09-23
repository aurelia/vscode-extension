import 'reflect-metadata';
import * as path from 'path';
import { commands, workspace, ExtensionContext } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient';
import { RelatedFiles } from './feature/relatedFiles';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  );
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    outputChannelName: 'Aurelia v2',
    documentSelector: [
      { scheme: 'file', language: 'html' },
      { scheme: 'file', language: 'typescript' },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'languageServerExample',
    'Aurelia v2',
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(
    commands.registerCommand('aurelia.getAureliaComponents', async () => {
      console.log('Getting...');
      const components = await client.sendRequest<string[]>(
        'aurelia-get-component-list'
      );
      console.log(`Found >${components.length}< components.`);
      console.log('TCL: activate -> components', components);
    })
  );

  context.subscriptions.push(new RelatedFiles());

  // Start the client. This will also launch the server
  client.start();

  /** ISSUE-VaNcstW0 */
  // await client.onReady();
  // User Information
  // client.onRequest('warning:no-tsconfig-found', () => {
  //   const message = '[Aurelia] No tsconfig.json found. Please visit the [Usage section](https://github.com/aurelia/vscode-extension#1-usage) for more information.';
  //   vscode.window.showWarningMessage(message, 'Close')
  // })
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
