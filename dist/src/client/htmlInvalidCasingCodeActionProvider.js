'use strict';
const vscode = require("vscode");
class HtmlInvalidCasingActionProvider {
    activate(subscriptions) {
        this.command = vscode.commands.registerCommand(HtmlInvalidCasingActionProvider.commandId, this.fixInvalidCasing, this);
        subscriptions.push(this);
    }
    provideCodeActions(document, range, context, token) {
        let diagnostic = context.diagnostics[0];
        let text = document.getText(diagnostic.range);
        const kebabCaseValidationRegex = /(.*)\.(bind|one-way|two-way|one-time|call|delegate|trigger)/;
        let result = kebabCaseValidationRegex.exec(text);
        let attribute = result[1];
        let binding = result[2];
        let fixedAttribute = attribute.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
        let fixedText = `${fixedAttribute}.${binding}`;
        let commands = [];
        commands.push({
            arguments: [document, diagnostic.range, fixedText],
            command: HtmlInvalidCasingActionProvider.commandId,
            title: `Rename ${attribute} to ${fixedAttribute}`,
        });
        return commands;
    }
    fixInvalidCasing(document, range, fixedText) {
        let edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, range, fixedText);
        return vscode.workspace.applyEdit(edit);
    }
    dispose() {
        this.command.dispose();
    }
}
HtmlInvalidCasingActionProvider.commandId = 'aurelia-fix-invalid-casing';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HtmlInvalidCasingActionProvider;
//# sourceMappingURL=htmlInvalidCasingCodeActionProvider.js.map