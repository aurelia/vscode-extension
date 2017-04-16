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
    
    let snippetPrefix = nextChar === '=' ? '' : `="$0"`;
    let result: Array<CompletionItem> = [];
    let element = this.library.elements[tagDef.name];

    if (element) {
      
      let bindings = [
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
      ]

      // check attributes
      if (element.attributes) {
        let attribute = element.attributes.get(attributeDef.name);
        if (attribute) {
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

      // check events
      if (element.events) {
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
    }

    return result;
  }
}
