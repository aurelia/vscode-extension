import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';

@autoinject()
export default class ElementCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(closing:string): Array<CompletionItem> {

    let result: Array<CompletionItem> = [];
    if (closing) {
      result.push({
        documentation: this.library.elements[closing].documentation,
        insertText: '/' + closing + '>',
        insertTextFormat: InsertTextFormat.PlainText,
        kind: CompletionItemKind.Property,
        label: `</${closing}>`
      });
    }

    for(let name in this.library.elements) {
          result.push({
            documentation: this.library.elements[name].documentation,
            insertText: name + '>',
            insertTextFormat: InsertTextFormat.PlainText,
            kind: CompletionItemKind.Property,
            label: `<${name}>`
          });
    }
    return result;
  }
}
