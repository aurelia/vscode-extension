import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';

@autoinject()
export default class ElementCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(previous:string): Array<CompletionItem> {

    let result: Array<CompletionItem> = [];
    if (previous) {

      let previousElement = this.library.elements[previous];
      if (previousElement) {
        result.push({
          documentation: MarkedString.fromPlainText(previousElement.documentation).toString(),
          detail: 'HTMLElement',
          insertText: '/' + previous + '>',
          insertTextFormat: InsertTextFormat.PlainText,
          kind: CompletionItemKind.Property,
          label: `/${previous}>`
        });

        if (previousElement.permittedChildren && previousElement.permittedChildren.length) {
          for(let name of previousElement.permittedChildren) {
                result.push({
                  documentation: this.library.elements[name].documentation,
                  detail: 'HTMLElement',
                  insertText: name + '>',
                  insertTextFormat: InsertTextFormat.PlainText,
                  kind: CompletionItemKind.Property,
                  label: `${name}>`
                });
          }
          return result;
        }
      }
    }

    for(let name in this.library.elements) {
      result.push({
        documentation: MarkedString.fromPlainText(this.library.elements[name].documentation).toString(),
        detail: 'HTMLElement',
        insertText: name + '>',
        insertTextFormat: InsertTextFormat.PlainText,
        kind: CompletionItemKind.Property,
        label: `${name}>`            
      });
    }

    return result;
  }
}
