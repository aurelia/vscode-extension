import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { TagDefinition, AttributeDefinition } from './../DocumentParser';

@autoinject()
export default class BindingCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(tagDef: TagDefinition, attributeDef: AttributeDefinition, nextChar: string): Array<CompletionItem> {
    
    let snippetPrefix = nextChar === ' ' ? `="$0"` : '';

    let result: Array<CompletionItem> = [];

    let element = this.library.elements[tagDef.name];
    if (element) {
      // check attributes
      let attribute = element.attributes.get(attributeDef.name);
      if (attribute) {
        for(let binding of ['bind', 'one-way', 'two-way', 'one-time']) {
          result.push({
            documentation: binding,
            insertText: `${binding}${snippetPrefix}`,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: `.${binding}=""`
          });
        }
      }

      // check events
      let event = element.events.get(attributeDef.name);
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
    return result;
  }
}
