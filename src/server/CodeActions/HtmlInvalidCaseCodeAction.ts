import { Diagnostic, TextEdit, Command, TextDocument } from "vscode-languageserver";
import { HTMLDocumentParser } from "../FileParser/HTMLDocumentParser";
import { attributeInvalidCaseFix } from "../Common/AttributeInvalidCaseFix";

export class HtmlInvalidCaseCodeAction {
  public name: string = 'aurelia-attribute-invalid-case';

  public async commands(diagnostic: Diagnostic, document: TextDocument): Promise<Command> {
    const text = document.getText();
    const start = document.offsetAt(diagnostic.range.start);
    const end = document.offsetAt(diagnostic.range.end);
    const parser = new HTMLDocumentParser();
    const element = await parser.getElementAtPosition(text, start, end);

    const original = text.substring(start, end);
    let fixed = original;
    if (typeof element !== 'undefined') {
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
