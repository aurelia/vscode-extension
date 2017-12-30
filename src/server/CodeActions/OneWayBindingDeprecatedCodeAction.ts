import { Diagnostic, TextEdit } from "vscode-languageserver-types";
import { Command } from "vscode-languageserver-protocol";
import { TextDocument } from "vscode-languageserver";

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
