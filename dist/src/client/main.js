"use strict";
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const aureliaCLICommands_1 = require("./aureliaCLICommands");
const htmlInvalidCasingCodeActionProvider_1 = require("./htmlInvalidCasingCodeActionProvider");
let outputChannel;
function activate(context) {
    // Create default output channel
    outputChannel = vscode_1.window.createOutputChannel('aurelia');
    context.subscriptions.push(outputChannel);
    // Register CLI commands
    context.subscriptions.push(aureliaCLICommands_1.default.registerCommands(outputChannel));
    // Register code fix
    const invalidCasingAction = new htmlInvalidCasingCodeActionProvider_1.default();
    invalidCasingAction.activate(context.subscriptions);
    vscode_1.languages.registerCodeActionsProvider('html', invalidCasingAction);
    // Register Aurelia language server
    const serverModule = context.asAbsolutePath(path.join('dist', 'src', 'server', 'main.js'));
    const debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };
    const serverOptions = {
        debug: { module: serverModule, options: debugOptions, transport: vscode_languageclient_1.TransportKind.ipc },
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
    };
    const clientOptions = {
        diagnosticCollectionName: 'Aurelia',
        documentSelector: ['html'],
        initializationOptions: {},
        synchronize: {
            configurationSection: ['aurelia'],
        },
    };
    const client = new vscode_languageclient_1.LanguageClient('html', 'Aurelia', serverOptions, clientOptions);
    const disposable = client.start();
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=main.js.map