'use strict';
import vscode = require('vscode');
import { attributeInvalidCaseFix } from './../shared/attributeInvalidCaseFix';

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

      const diagnostic: vscode.Diagnostic = context.diagnostics[0];
      const text = document.getText(diagnostic.range);

      const elementResult = /<([a-zA-Z\-]*) .*$/g.exec(document.getText(diagnostic.range.with(new vscode.Position(0,0))));
      const elementName = elementResult[1];

      const {attribute, command, fixed} = attributeInvalidCaseFix(elementName, text);
      const fixedText = `${fixed}.${command}`;
      const commands: vscode.Command[] = [];

      commands.push({
            arguments: [document, diagnostic.range, fixedText],
            command: HtmlInvalidCasingActionProvider.commandId,
            title: `Rename ${attribute} to ${fixed}`,
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
