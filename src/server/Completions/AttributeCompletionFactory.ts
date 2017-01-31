import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/elementLibrary';

@autoinject()
export default class AureliaAttributeCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(elementName: string, existingAttributes: Array<string>): Array<CompletionItem> {

console.dir(existingAttributes);

    let result:Array<CompletionItem> = [];

    let element = this.library.elements[elementName];
    if (element && element.attributes) {
      for (let [key, value] of element.attributes.entries()) {
        console.log('key: ' + key);
        if (existingAttributes.filter(i => i === key).length) {
          continue;
        }

        result.push({
            documentation: value.documentation,
            insertText: `${key}="$0"`,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: key,
          });

        result.push({
          documentation: value.documentation,
          insertText: `${key}.bind="$0"`,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Value,
          label: key + '.bind',
        });       
      }
    }

    return result;
  }
}
