import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { TagDefinition, AttributeDefinition } from './../DocumentParser';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import { GlobalAttributes } from './Library/_elementStructure';
import AureliaSettings from './../AureliaSettings';

@autoinject()
export default class BindingCompletionFactory extends BaseAttributeCompletionFactory {
  
  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(tagDef: TagDefinition, attributeDef: AttributeDefinition, nextChar: string): Array<CompletionItem> {
    
    let snippetPrefix = nextChar === '=' ? '' : `=${this.settings.quote}$0${this.settings.quote}`;
    let result: Array<CompletionItem> = [];
    
    let element = this.getElement(tagDef.name);
    if (!element.events.get(attributeDef.name) && !GlobalAttributes.events.get(attributeDef.name)) {
      this.setAttributes(element.attributes, attributeDef.name, snippetPrefix, result);
    }

    this.setEvents(element.events, attributeDef.name, snippetPrefix, result);

    return result;
  }

  private setEvents(events, name, snippetPrefix, result) {
      let event = events.get(name);
      if (!event) {
        event = GlobalAttributes.events.get(name);
      }    

      if (event) {
        if (event.bubbles) {
          for(let binding of ['delegate', 'capture']) {
            result.push({
              documentation: binding,
              insertText: binding + snippetPrefix,
              insertTextFormat: InsertTextFormat.Snippet,
              kind: CompletionItemKind.Property,
              label: `.${binding}=${this.settings.quote}${this.settings.quote}`
            });
          }                      
        }

        for (let binding of ['trigger', 'call']) {
          result.push({
            documentation: binding,
            insertText: binding + snippetPrefix,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: `.${binding}=${this.settings.quote}${this.settings.quote}`
          });
        }        
      }    
  }

  private setAttributes(attributes, name, snippetPrefix, result) {
      let attribute = attributes.get(name);
      if (!attribute) {
        attribute = GlobalAttributes.attributes.get(name);
      }

      for(let binding of this.settings.bindings.data) {
        result.push({
          documentation: binding.documentation,
          insertText: `${binding.name}${snippetPrefix}`,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Property,
          label: `.${binding.name}=${this.settings.quote}${this.settings.quote}`
        });
      }   
  }
}
