import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, 
  MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { BaseElement, SimpleAttribute, BindableAttribute, EmptyAttribute } from './Library/_elementStructure';

@autoinject()
export default class BaseAttributeCompletionFactory {

  constructor(protected library: ElementLibrary) { }

  protected getElement(elementName: string) : BaseElement {
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

      // remove duplicates (only leave latest addition)
      for(let item of result.filter(i => 
        i.label === key || 
        i.label === (value.customLabel === null ? (key + '.bind') : value.customLabel))) {
        let index = result.indexOf(item, 0);
        if (index > -1) {
          result.splice(index, 1);
        }        
      }

      if (value instanceof BindableAttribute) {
        result.push({
          documentation: MarkedString.fromPlainText(value.documentation).toString(),
          detail: 'Bindable Attribute',
          insertText: value.customBindingSnippet === null ? `${key}.bind="$0"`: value.customBindingSnippet,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Value,
          label: value.customLabel === null ? (key + '.bind') : value.customLabel,
        });
      }

      if (value instanceof EmptyAttribute) {
        result.push({
          detail: 'Empty Custom Attribute',
          documentation: MarkedString.fromPlainText(value.documentation).toString(),
          insertText: `${key}`,
          insertTextFormat: InsertTextFormat.PlainText,
          kind: CompletionItemKind.Property,
          label: key,
        });        
      }

      if (value instanceof SimpleAttribute || value instanceof BindableAttribute) {
        result.push({
          documentation: MarkedString.fromPlainText(value.documentation).toString(),
          detail: 'Attribute',
          insertText: `${key}="$0"`,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Property,
          label: key,
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
        documentation: value.documentation,
        detail: 'Event',
        insertText: value.bubbles ? `${key}.delegate="$0"` : `${key}.trigger="$0"`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Function,
        label: key + (value.bubbles ? `.delegate` : `.trigger`),
      }); 
    }

    return result;
  }
}
