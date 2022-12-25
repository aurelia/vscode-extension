import 'reflect-metadata';
import * as path from 'path';

import { commands, window, workspace, ExtensionContext } from 'vscode';
import {
  Disposable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  StaticFeature,
  ClientCapabilities,
  DocumentSelector,
  ServerCapabilities,
} from 'vscode-languageclient';

import { RelatedFiles } from './feature/relatedFiles';
import { getUserInputCommand } from './feature/userInput/userInput';

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
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
    outputChannelName: 'Aurelia',
    documentSelector: [
      { scheme: 'file', language: 'html' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'javascript' },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'languageServerExample',
    'Aurelia',
    serverOptions,
    clientOptions
  );

  client.registerFeature(new TriggerCharacterFeature());

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

  // context.subscriptions.push(
  //   commands.registerCommand('extension.au.reloadExtension', () => {
  //     console.log('ok');
  //   })
  // );
  context.subscriptions.push(
    Disposable.create(() => {
      commands.registerTextEditorCommand(
        'extension.au.refactor.component',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      );
    })
  );

  // Start the client. This will also launch the server
  client.start();

  /** ISSUE-VaNcstW0 */
  await client.onReady();
  // User Information
  // client.onRequest('warning:no-tsconfig-found', () => {
  //   const message = '[Aurelia] No tsconfig.json found. Please visit the [Usage section](https://github.com/aurelia/vscode-extension#1-usage) for more information.';
  //   vscode.window.showWarningMessage(message, 'Close')
  // })

  client.onRequest('get-component-name', () => {
    getUserInputCommand(context);

    var editor = window.activeTextEditor;
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: extension.ts ~ line 115 ~ editor?.selections', editor?.selections)

    // const message = '[Aurelia] No tsconfig.json found. Please visit the [Usage section](https://github.com/aurelia/vscode-extension#1-usage) for more information.';
    // window.showWarningMessage(message, 'Close')
  });

  client.onRequest('get-editer-selections', () => {
    var editor = window.activeTextEditor;
    const documentText = editor?.document.getText();
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: extension.ts ~ line 120 ~ documentText', documentText)
    return {
      documentText,
      documentUri: editor?.document.uri.toString(),
      documentPath: editor?.document.fileName,
      selections: editor?.selections,
    };
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (client === undefined) {
    return undefined;
  }
  return client.stop();
}

class TriggerCharacterFeature implements StaticFeature {
  fillClientCapabilities(capabilities: ClientCapabilities): void {
    // @ts-ignore
    capabilities.textDocument?.completion?.contextSupport = true;
  }
  initialize(
    capabilities: ServerCapabilities,
    documentSelector: DocumentSelector | undefined
  ): void {}
}
