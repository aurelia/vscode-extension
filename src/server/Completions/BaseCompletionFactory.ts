import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, 
  MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';

@autoinject()
export default class BaseCompletionFactory {

  constructor(protected library: ElementLibrary) { }

  protected getElement(elementName: string){
    let element = this.library.elements[elementName];
    if (!element) {
      element = this.library.unknownElement;
    }
    return element;    
  }

  protected addAttributes(attributes, result: CompletionItem[], existingAttributes) {

    for (let [key, value] of attributes.entries()) {
      if (existingAttributes.filter(i => i === key).length || value === null) {
        continue;
      }

      // remove exiting items that are doubles
      for(let item of result.filter(i => 
        i.label === key || 
        i.label === (value.customLabel === null ? (key + '.bind') : value.customLabel))) {
        let index = result.indexOf(item, 0);
        if (index > -1) {
          result.splice(index, 1);
        }        
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

      if (value.customBindingSnippet !== 'no-snippet') {
        result.push({
          //detail: value.documentation,
          insertText: value.customBindingSnippet === null ? `${key}.bind="$0"`: value.customBindingSnippet,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Value,
          label: value.customLabel === null ? (key + '.bind') : value.customLabel,
        });
      }
    }  
    return result;  
  }

  protected addEvents(events, result, existingAttributes) {

    for (let [key, value] of events.entries()) { 

      if (existingAttributes.filter(i => i === key).length || value === null) {
        continue;
      }

      // remove exiting items that are doubles
      for(let item of result.filter(i => 
        i.label === key || 
        i.label === key + (value.bubbles ? `.delegate` : `.trigger`))) {
        let index = result.indexOf(item, 0);
        if (index > -1) {
          result.splice(index, 1);
        }        
      }

      result.push({
        detail: value.documentation,
        insertText: value.bubbles ? `${key}.delegate="$0"` : `${key}.trigger="$0"`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Function,
        label: key + (value.bubbles ? `.delegate` : `.trigger`),
      }); 
    }

    return result;
  }
}
