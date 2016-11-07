'use strict';
import vscode = require('vscode');

export default class HtmlInvalidCasingActionProvider implements vscode.CodeActionProvider {
  private static commandId: string = 'aurelia-fix-invalid-casing';
  private command: vscode.Disposable;

  public activate(subscriptions: vscode.Disposable[]) {
    this.command = vscode.commands.registerCommand(HtmlInvalidCasingActionProvider.commandId, this.fixInvalidCasing, this);
    subscriptions.push(this);
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken): vscode.Command[] {

      let diagnostic: vscode.Diagnostic = context.diagnostics[0];
      let text = document.getText(diagnostic.range);
      const kebabCaseValidationRegex = /(.*)\.(bind|one-way|two-way|one-time|call|delegate|trigger)/;

      let result = kebabCaseValidationRegex.exec(text);
      let attribute = result[1];
      let binding = result[2];
      let fixedAttribute = attribute.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
      let fixedText = `${fixedAttribute}.${binding}`;
      let commands: vscode.Command[] = [];

      commands.push({
            arguments: [document, diagnostic.range, fixedText],
            command: HtmlInvalidCasingActionProvider.commandId,
            title: `Rename ${attribute} to ${fixedAttribute}`,
        });

      return commands;
  }

  public fixInvalidCasing(document, range, fixedText) {
    let edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, fixedText);
    return vscode.workspace.applyEdit(edit);
  }

  public dispose(): void {
    this.command.dispose();
  }
}
