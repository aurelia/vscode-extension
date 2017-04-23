import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';

@autoinject()
export default class AttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary) { super(library); }

  public create(elementName: string, attributeName: string, bindingName: string): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];
    
    if (bindingName === undefined || bindingName === null || bindingName === '') {
      let element = this.getElement(elementName);

      let attribute = element.attributes.get(attributeName);
      if (!attribute) {
        attribute = GlobalAttributes.attributes.get(attributeName);
      }

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
