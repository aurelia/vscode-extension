import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';

@autoinject()
export default class AureliaAttributeCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(elementName: string, existingAttributes: Array<string>): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];

    let element = this.library.elements[elementName];
    if (element && element.attributes) {
      for (let [key, value] of element.attributes.entries()) {
        if (existingAttributes.filter(i => i === key).length || value === null) {
          continue;
        }

        if (value.customSnippet !== 'no-snippet') {
          result.push({
            documentation: MarkedString.fromPlainText(value.documentation).toString(),
            insertText: value.customSnippet === null ? `${key}="$0"`: value.customSnippet,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: key,
          });
        }
        if (typeof(value.customBindingSnippet) !== 'no-snippet') {
          console.log(key, value.customLabel === true);
          result.push({
            //detail: value.documentation,
            insertText: value.customBindingSnippet === null ? `${key}.bind="$0"`: value.customBindingSnippet,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Value,
            label: value.customLabel === null ? (key + '.bind') : value.customLabel,
          });
        }
      }

      if (element && element.events) {
        for (let [key, value] of element.events.entries()) { 
          result.push({
            detail: value.documentation,
            insertText: value.bubbles ? `${key}.delegate="$0"` : `${key}.trigger="$0"`,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Function,
            label: key + (value.bubbles ? `.delegate` : `.trigger`),
          }); 
        }
      }
    }

    return result;
  }
}
