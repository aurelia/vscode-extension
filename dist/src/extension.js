"use strict";
const vscode_1 = require('vscode');
const aureliaCLICommands_1 = require('./aureliaCLICommands');
const aurerliaHtmlCompletionProvider_1 = require('./aurerliaHtmlCompletionProvider');
let outputChannel;
function activate(context) {
    // Create default output channel
    outputChannel = vscode_1.window.createOutputChannel('aurelia');
    context.subscriptions.push(outputChannel);
    // Register CLI commands
    context.subscriptions.push(aureliaCLICommands_1.default.registerCommands(outputChannel));
    // Register completion
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('html', new aurerliaHtmlCompletionProvider_1.default(), '.'));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map