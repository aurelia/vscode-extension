"use strict";
const vscode_1 = require('vscode');
let outputChannel;
function activate(context) {
    // Create default output channel
    outputChannel = vscode_1.window.createOutputChannel('aurelia');
    context.subscriptions.push(outputChannel);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map