import { Diagnostic, TextEdit, Command, TextDocument } from "vscode-languageserver";

export class OneWayBindingDeprecatedCodeAction {
  public name: string = 'aurelia-binding-one-way-deprecated';

  public commands(diagnostic: Diagnostic, document: TextDocument): Command {

    return Command.create(
      `Change 'one-way' binding behaviour to 'to-view'`,
      'aurelia-binding-one-way-deprecated',
      document.uri,
      document.version,
      [
        TextEdit.replace(diagnostic.range, 'to-view')
      ]);
  }
}
