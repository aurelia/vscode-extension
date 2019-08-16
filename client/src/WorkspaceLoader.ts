import { workspace as Workspace, OutputChannel } from 'vscode';
import { LanguageClient, TransportKind, LanguageClientOptions, ServerOptions, WorkspaceFolder } from 'vscode-languageclient';
import * as path from 'path';
import { asyncForEach } from './util/asyncForEach';
import { clients } from './clients';

/**
 * Responsible for creating clients for each separate workspace
 *
 * @export
 * @class WorkspaceLoader
 */
export class WorkspaceLoader {

  constructor(private channel: OutputChannel, private serverModule: string) {
  }

  /**
   * Load the initial workspace state and subscribe to changes of the workspace(s).
   *
   * @memberof WorkspaceLoader
   */
  public async load() {
    
    this.channel.appendLine('⚙️ checking workspaces for Aurelia workspaces');
    await this.initializeWorkspaces();
    this.watchForWorkspaceChanges();
  }

  private async initializeWorkspaces() {
    try {
      await asyncForEach(Workspace.workspaceFolders, this.addWorkspaceFolder.bind(this));
    } catch(err) {
      this.channel.appendLine(err);
    }
    
  }

  private watchForWorkspaceChanges() {
    Workspace.onDidChangeWorkspaceFolders(async (event) => {
      
      if (event.added.length > 0) {
        this.channel.appendLine('⚙️ checking newly added workspace(s)');
        await asyncForEach(event.added, this.addWorkspaceFolder.bind(this));
      }

      if (event.removed.length > 0) {
        this.channel.appendLine('⚙️ checking removed workspace(s)');
        for (let folder of event.removed) {
          let client = clients.get(folder.uri.toString());
          if (client) {
            clients.delete(folder.uri.toString());
            client.stop();
            this.channel.appendLine('⚰️   client stopped and deleted');
          }
        }
      }

    });
  }

  private async addWorkspaceFolder(folder) {
    
    this.channel.appendLine("  ⚙️ processing workspace: " + folder.uri.toString());
    
    const workspacePath = folder.uri.fsPath;
    const packageJsonPath = path.join(workspacePath, 'package.json');
    const document = await Workspace.openTextDocument(packageJsonPath);
    
    let packageJson = JSON.parse(document.getText());
    let isAureliaProject = false;
    for (let npmPackage in packageJson.dependencies) {
      if (packageJson.dependencies[npmPackage] && npmPackage.startsWith('@aurelia/')) {
        isAureliaProject = true;
        break;
      }
    }
    if (!isAureliaProject) {
      return;
    }
    this.channel.appendLine("    🌱 activating Aurelia2 plugin for workspace: " + folder.uri.toString());
    const debugOptions = { execArgv: ["--nolazy", `--inspect=${6011 + clients.size}`] };
    const serverOptions: ServerOptions = {
      run: { module: this.serverModule, transport: TransportKind.ipc },
      debug: { module: this.serverModule, transport: TransportKind.ipc, options: debugOptions }
    };
    const clientOptions: LanguageClientOptions = {
      documentSelector: [
        { scheme: 'file', language: 'plaintext', pattern: `${folder.uri.toString()}/**/*` }
      ],
      diagnosticCollectionName: 'aurelia|' + folder.uri.toString(),
      workspaceFolder: folder,
      outputChannel: this.channel
    };
    const client = new LanguageClient('aurelia', serverOptions, clientOptions);
    client.start();
    clients.set(folder.uri.toString(), client);
  }
}
