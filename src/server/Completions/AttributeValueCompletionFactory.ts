import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';

@autoinject()
export default class AureliaAttributeCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(elementName: string, attributeName: string, bindingName: string): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];
    
    if (bindingName === undefined || bindingName === null || bindingName === '') {
      let element = this.library.elements[elementName];
      let attribute = element.attributes.get(attributeName);
      if (attribute && attribute.values) {
        for (let [key, value] of attribute.values.entries()) {
          result.push({
              documentation: value.documentation,
              insertText: key,
              insertTextFormat: InsertTextFormat.Snippet,
              kind: CompletionItemKind.Property,
              label: key,
            });
        }
      }
    }

    return result;
  }
}
