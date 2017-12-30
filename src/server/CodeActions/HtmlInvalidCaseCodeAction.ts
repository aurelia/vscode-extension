import { Diagnostic, TextEdit } from "vscode-languageserver-types/lib/main";
import { Command } from "vscode-languageserver-protocol/lib/main";
import { DocumentParser } from "../DocumentParser";
import { TextDocument } from "vscode-languageserver/lib/main";
import { attributeInvalidCaseFix } from "../Common/AttributeInvalidCaseFix";

export class HtmlInvalidCaseCodeAction {
  public name = 'aurelia-attribute-invalid-case';

  public async commands(diagnostic: Diagnostic, document: TextDocument): Promise<Command> {
    const text = document.getText();
    const start = document.offsetAt(diagnostic.range.start);
    const end = document.offsetAt(diagnostic.range.end);
    const parser = new DocumentParser();
    const element = await parser.getElementAtPosition(text, start, end);

    const original = text.substring(start, end);
    let fixed = original;
    if (element) {
      fixed = attributeInvalidCaseFix(fixed, element.name);
    }

    return Command.create(
      `Rename ${original} to ${fixed}`, 
      'aurelia-attribute-invalid-case', 
      document.uri, 
      document.version, 
      [
        TextEdit.replace(diagnostic.range, fixed)
      ]);
  }
}
