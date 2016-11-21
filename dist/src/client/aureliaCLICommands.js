"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
class AureliaCliCommands {
    static registerCommands(outputChannel) {
        return vscode.Disposable.from(vscode.commands.registerCommand('extension.auNew', () => this.auNew(outputChannel)), vscode.commands.registerCommand('extension.auGenerate', () => this.auGenerate(outputChannel)), vscode.commands.registerCommand('extension.auBuild', () => this.auBuild(outputChannel)), vscode.commands.registerCommand('extension.auTest', () => this.runCommand(['test'], outputChannel)), vscode.commands.registerCommand('extension.auRun', () => this.runCommand(['run'], outputChannel, 'aurelia-cli')));
    }
    static auNew(outputChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectName = yield vscode.window.showInputBox({ placeHolder: 'Please enter a name for your new project' });
            this.runCommand(['new', projectName], outputChannel, 'aurelia-cli');
        });
    }
    static auGenerate(outputChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = ['generate'];
            let type = yield vscode.window.showQuickPick(this.getGeneratorTypes(), { matchOnDescription: false, placeHolder: 'Select type' });
            param.push(type);
            let name = yield vscode.window.showInputBox({ placeHolder: `What would you like to call the ${type}?` });
            param.push(name);
            this.runCommand(param, outputChannel);
        });
    }
    static auBuild(outputChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = ['build'];
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
                this.runCommand(param, outputChannel);
            });
        });
    }
    static getGeneratorTypes() {
        let items = [];
        fs.readdirSync(path.join(vscode.workspace.rootPath, 'aurelia_project/generators')).forEach(name => {
            if (path.extname(name) === '.ts' || path.extname(name) === '.js') {
                items.push(path.basename(name.replace('.ts', '').replace('.js', '')));
            }
        });
        return items;
    }
    static showOutput(outputChannel) {
        outputChannel.show(vscode.ViewColumn.One);
    }
    static runCommand(args, outputChannel, terminalName) {
        let cwd = vscode.workspace.rootPath;
        if (terminalName && terminalName.length) {
            this.runCommandInTerminal(args);
        }
        else {
            this.runCommandInOutputWindow(args, cwd, outputChannel);
        }
    }
    static runCommandInOutputWindow(args, cwd, outputChannel) {
        let cmd = 'au ' + args.join(' ');
        let childProcess = cp.exec(cmd, { cwd: cwd, env: process.env });
        childProcess.stderr.on('data', data => outputChannel.append(data));
        childProcess.stdout.on('data', data => outputChannel.append(data));
        this.showOutput(outputChannel);
    }
    static runCommandInTerminal(args) {
        let terminal = vscode.window.createTerminal('aurelia-cli');
        terminal.show(true);
        terminal.sendText('au ' + args.join(' '), true);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AureliaCliCommands;
//# sourceMappingURL=aureliaCLICommands.js.map