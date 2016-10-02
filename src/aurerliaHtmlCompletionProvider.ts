import * as vscode from 'vscode';
import AureliaHtmlCompletionOptionsFactory from './aureliaHtmlCompletionOptionsFactory';

export default class AurerliaHtmlCompletionProvider implements vscode.CompletionItemProvider {

  private static regex = /([a-zA-Z0-9:-]+)\.$/;

  public provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken): vscode.CompletionItem[] | Thenable<vscode.CompletionItem[]> {

    let stringToValidate = document.lineAt(position).text.substring(0, position.character);
    let matchResult = AurerliaHtmlCompletionProvider.regex.exec(stringToValidate);

    if (matchResult.length > 1) {
      return AureliaHtmlCompletionOptionsFactory.getForAttribute(matchResult[1]);
    }

    return [];
  }
}
