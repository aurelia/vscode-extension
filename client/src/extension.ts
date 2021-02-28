import 'reflect-metadata';
import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';
import * as ts from 'typescript';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient';
import { RelatedFiles } from './feature/relatedFiles';

let client: LanguageClient;

class SearchDefinitionInView implements vscode.DefinitionProvider {
  public client: LanguageClient;

  public constructor(client: LanguageClient) {
    this.client = client;
  }

  public async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.DefinitionLink[]> {
    const goToSourceWordRange = document.getWordRangeAtPosition(position);
    const goToSourceWord = document.getText(goToSourceWordRange);

    try {
      const result = await this.client.sendRequest<{
        lineAndCharacter: ts.LineAndCharacter;
        viewModelFilePath: string;
        viewFilePath: string;
      }>('get-virtual-definition', {
        documentContent: document.getText(),
        position,
        goToSourceWord,
        filePath: document.uri.path,
      });

      const { line, character } = result.lineAndCharacter;
      const targetPath = result.viewFilePath || result.viewModelFilePath;

      return [
        {
          targetUri: vscode.Uri.file(targetPath),
          targetRange: new vscode.Range(
            new vscode.Position(line - 1, character),
            new vscode.Position(line, character)
          ),
        },
      ];
    } catch (err) {
      console.log('TCL: SearchDefinitionInView -> err', err);
    }
  }
}

class HoverInView implements vscode.HoverProvider {
  public client: LanguageClient;

  public constructor(client: LanguageClient) {
    this.client = client;
  }

  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Hover> {
    const goToSourceWordRange = document.getWordRangeAtPosition(position);
    const goToSourceWord = document.getText(goToSourceWordRange);

    try {
      const result = await this.client.sendRequest<{
        contents: { kind: string; value: string };
        documentation: string;
      }>('get-virtual-hover', {
        documentContent: document.getText(),
        position,
        goToSourceWord,
        filePath: document.uri.path,
      });

      const markdown = new vscode.MarkdownString(result.contents.value, false);

      return {
        contents: [markdown, result.documentation],
      };
    } catch (err) {
      console.log('TCL: SearchDefinitionInView -> err', err);
    }
  }
}

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
    documentSelector: [{ scheme: 'file', language: 'html' }],
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
    vscode.commands.registerCommand(
      'aurelia.getAureliaComponents',
      async () => {
        console.log('Getting...');
        const components = await client.sendRequest<string[]>(
          'aurelia-get-component-list'
        );
        console.log(`Found >${components.length}< components.`);
        console.log('TCL: activate -> components', components);
      }
    )
  );

  context.subscriptions.push(new RelatedFiles());

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { scheme: 'file', language: 'html' },
      new SearchDefinitionInView(client)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'html' },
      new HoverInView(client)
    )
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
