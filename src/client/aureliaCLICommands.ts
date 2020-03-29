import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export default class AureliaCliCommands {

  public static registerCommands(outputChannel: vscode.OutputChannel): vscode.Disposable {
    return vscode.Disposable.from(
      vscode.commands.registerCommand('extension.auNew', () => this.auNew(outputChannel)),
      vscode.commands.registerCommand('extension.auGenerate', () => this.auGenerate(outputChannel)),
      vscode.commands.registerCommand('extension.auBuild', () => this.auBuild(outputChannel)),
      vscode.commands.registerCommand('extension.auTest', () => this.runCommand(['test'], outputChannel)),
      vscode.commands.registerCommand('extension.auRun', () => this.runCommand(['run'], outputChannel, 'aurelia-cli-run')),
      vscode.commands.registerCommand('extension.auRunWatch', () => this.runCommand(['run', '--watch'], outputChannel, 'aurelia-cli-run-watch')));
  }

  private static async auNew(outputChannel) {
    const projectName = await vscode.window.showInputBox({ placeHolder: 'Please enter a name for your new project' });
    this.runCommand(['new', projectName], outputChannel, 'aurelia-cli');
  }

  private static async auGenerate(outputChannel) {

    const param: string[] = ['generate'];
    const type = await vscode.window.showQuickPick(
      this.getGeneratorTypes(),
      { matchOnDescription: false, placeHolder: 'Select type' });
    param.push(type);

    const name = await vscode.window.showInputBox({ placeHolder: `What would you like to call the ${type}?` });
    param.push(name);

    this.runCommand(param, outputChannel);
  }

  private static async auBuild(outputChannel) {
    const param: string[] = ['build'];
    const auTemplatePath = path.join(vscode.workspace.rootPath, 'aurelia_project/environments');
    const items = [];

    fs.readdirSync(auTemplatePath).forEach((name) => {
      if (path.extname(name) === '.ts' || path.extname(name) === '.js') {
        items.push(path.basename(name.replace('.ts', '').replace('.js', '')));
      }
    });

    const options = { matchOnDescription: false, placeHolder: 'Select environment to build' };
    vscode.window.showQuickPick(items, options).then((data) => {
      param.push(`--env ${  data}`);
      this.runCommand(param, outputChannel);
    });
  }

  private static getGeneratorTypes() {
    const items = [];
    fs.readdirSync(path.join(vscode.workspace.rootPath, 'aurelia_project/generators')).forEach(name => {
      if (path.extname(name) === '.ts' || path.extname(name) === '.js') {
        items.push(path.basename(name.replace('.ts', '').replace('.js', '')));
      }
    });
    return items;
  }

  private static showOutput(outputChannel: vscode.OutputChannel): void {
    outputChannel.show(vscode.ViewColumn.One);
  }

  private static runCommand(args: string[], outputChannel: vscode.OutputChannel, terminalName?: string): void {
    const cwd = vscode.workspace.rootPath;
    if (terminalName?.length) {
      this.runCommandInTerminal(args);
    } else {
      this.runCommandInOutputWindow(args, cwd, outputChannel);
    }
  }

  private static runCommandInOutputWindow(args: string[], cwd: string, outputChannel: vscode.OutputChannel) {

    const cmd = `au ${  args.join(' ')}`;
    const childProcess = cp.exec(cmd, { cwd: cwd, env: process.env });
    childProcess.stderr.on('data', data => outputChannel.append(<string> data));
    childProcess.stdout.on('data', data => outputChannel.append(<string> data));

    this.showOutput(outputChannel);
  }

  private static async runCommandInTerminal(args: string[]): Promise<void> {
    try {
      fs.accessSync(path.join(vscode.workspace.rootPath, 'aurelia_project/aurelia.json'));
    } catch (e) {
      vscode.window.showErrorMessage(`Unable to find 'aurelia_project/aurelia.json'. Are you sure you are in the correct directory?`);
      return;
    }

    const terminal = vscode.window.createTerminal('aurelia-cli');
    terminal.show(true);
    terminal.sendText(`cd ${vscode.workspace.rootPath}`, true);
    terminal.sendText(`au ${  args.join(' ')}`, true);
  }
}
