"use strict";
const path = require("path");
const vscode_1 = require('vscode');
const vscode_languageclient_1 = require('vscode-languageclient');
const aureliaCLICommands_1 = require('./aureliaCLICommands');
let outputChannel;
function activate(context) {
    // Create default output channel
    outputChannel = vscode_1.window.createOutputChannel('aurelia');
    context.subscriptions.push(outputChannel);
    // Register CLI commands
    context.subscriptions.push(aureliaCLICommands_1.default.registerCommands(outputChannel));
    // Register Aurelia language server
    let serverModule = context.asAbsolutePath(path.join('dist', 'src', 'server', 'main.js'));
    let debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    let clientOptions = {
        documentSelector: ['html'],
        synchronize: {
            configurationSection: ['aurelia'],
        },
        initializationOptions: {}
    };
    let client = new vscode_languageclient_1.LanguageClient('html', 'Aurelia', serverOptions, clientOptions);
    let disposable = client.start();
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=main.js.map