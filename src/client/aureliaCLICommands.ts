import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { runInTerminal } from 'run-in-terminal';

export default class AureliaCliCommands {

  public static registerCommands(outputChannel: vscode.OutputChannel): vscode.Disposable {
    return vscode.Disposable.from(
      vscode.commands.registerCommand('extension.auNew', () => this.auNew(outputChannel)),
      vscode.commands.registerCommand('extension.auGenerate', () => this.auGenerate(outputChannel)),
      vscode.commands.registerCommand('extension.auTest', () => this.runCommand(['test'], outputChannel, false)),
      vscode.commands.registerCommand('extension.auBuild', () => this.auBuild(outputChannel)));
  }

  private static async auNew(outputChannel) {
    let projectName = await vscode.window.showInputBox({ placeHolder: 'Please enter a name for your new project' });
    this.runCommand(['new', projectName], outputChannel, true);
  }

  private static async auGenerate(outputChannel) {

    let param: string[] = ['generate'];
    let type = await vscode.window.showQuickPick(
      this.getGeneratorTypes(),
      { matchOnDescription: false, placeHolder: 'Select type' });
    param.push(type);

    let name = await vscode.window.showInputBox({ placeHolder: `What would you like to call the ${type}?` });
    param.push(name);

    this.runCommand(param, outputChannel, false);
  }

  private static async auBuild(outputChannel) {
    let param: string[] = ['build'];
    let auTemplatePath = path.join(vscode.workspace.rootPath, 'aurelia_project/environments');
    let items = [];

    fs.readdirSync(auTemplatePath).forEach((name) => {
      if (path.extname(name) === '.ts' || path.extname(name) === '.js') {
        items.push(path.basename(name.replace('.ts', '').replace('.js', '')));
      }
    });

    let options = { matchOnDescription: false, placeHolder: 'Select environment to build' };
    vscode.window.showQuickPick(items, options).then((data) => {
      param.push('--env ' + data);
      this.runCommand(param, outputChannel, false);
    });
  }

  private static getGeneratorTypes() {
    let items = [];
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

  private static runCommand(args: string[], outputChannel: vscode.OutputChannel, useTerminal?: boolean): void {
    let cwd = vscode.workspace.rootPath;
    if (useTerminal) {
      this.runCommandInTerminal(args, cwd);
    } else {
      this.runCommandInOutputWindow(args, cwd, outputChannel);
    }
  }

  private static runCommandInOutputWindow(args: string[], cwd: string, outputChannel: vscode.OutputChannel) {

    let cmd = 'au ' + args.join(' ');
    let childProcess = cp.exec(cmd, { cwd: cwd, env: process.env });
    childProcess.stderr.on('data', data => outputChannel.append(<string> data));
    childProcess.stdout.on('data', data => outputChannel.append(<string> data));

    this.showOutput(outputChannel);
  }

  private static runCommandInTerminal(args: string[], cwd: string): void {
    runInTerminal('au', args, { cwd: cwd, env: process.env });
  }
}
