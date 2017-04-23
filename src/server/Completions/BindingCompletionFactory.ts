import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { TagDefinition, AttributeDefinition } from './../DocumentParser';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import { GlobalAttributes } from './Library/_elementStructure';

@autoinject()
export default class BindingCompletionFactory extends BaseAttributeCompletionFactory {
  
  constructor(library: ElementLibrary) { super(library); }

  public create(tagDef: TagDefinition, attributeDef: AttributeDefinition, nextChar: string): Array<CompletionItem> {
    
    let snippetPrefix = nextChar === '=' ? '' : `="$0"`;
    let result: Array<CompletionItem> = [];
    
    let element = this.getElement(tagDef.name);
    
    if (element.attributes) {
      this.setAttributes(element.attributes, attributeDef.name, snippetPrefix, result);
    }

    if (element.events) {
      this.setEvents(element.events, attributeDef.name, snippetPrefix, result);
    }

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
              label: `.${binding}=""`
            });
          }                      
        }

        for (let binding of ['trigger', 'call']) {
          result.push({
            documentation: binding,
            insertText: binding + snippetPrefix,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: `.${binding}=""`
          });
        }        
      }    
  }

  private setAttributes(attributes, name, snippetPrefix, result) {
      let attribute = attributes.get(name);
      if (!attribute) {
        attribute = GlobalAttributes.attributes.get(name);
      }

      if (attribute) {
        let bindings = this.getDefaultDataBindings();
        for(let binding of bindings) {
          result.push({
            documentation: binding.documentation,
            insertText: `${binding.name}${snippetPrefix}`,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: `.${binding.name}=""`
          });
        }
      }    
  }

  private getDefaultDataBindings() {
    return [
        { 
          name: 'bind',
          documentation: 'automatically chooses the binding mode. Uses two-way binding for form controls and one-way binding for almost everything else'
        },
        { 
          name: 'one-way',
          documentation: 'flows data one direction: from the view-model to the view'
        },
        { 
          name: 'two-way',
          documentation: 'flows data both ways: from view-model to view and from view to view-model'
        },
        { 
          name: 'one-time',
          documentation: 'flows data one direction: from the view-model to the view, only one'
        },                        
      ];
  }
}
