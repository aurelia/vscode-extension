import { Diagnostic, TextEdit, Command, TextDocument } from "vscode-languageserver-types";

export class OneWayBindingDeprecatedCodeAction {
  public name = 'aurelia-binding-one-way-deprecated';

  public async commands(diagnostic: Diagnostic, document: TextDocument): Promise<Command> {

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
