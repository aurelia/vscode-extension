import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { TagDefinition, AttributeDefinition } from "../FileParser/HTMLDocumentParser";
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import { GlobalAttributes } from './Library/_elementStructure';
import AureliaSettings from "../AureliaSettings";

@autoinject()
export default class BindingCompletionFactory extends BaseAttributeCompletionFactory {

  public constructor(
    public library: ElementLibrary,
    private readonly settings: AureliaSettings) {
    super(library);
  }

  public create(tagDef: TagDefinition, attributeDef: AttributeDefinition, nextChar: string): CompletionItem[] {

    const snippetPrefix = nextChar === '=' ? '' : `=${this.settings.quote}$0${this.settings.quote}`;
    const result: CompletionItem[] = [];

    const element = this.getElement(tagDef.name);
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
        for (const binding of ['delegate', 'capture']) {
          result.push({
            documentation: binding,
            insertText: binding + snippetPrefix,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: `.${binding}=${this.settings.quote}${this.settings.quote}`
          });
        }
      }

      for (const binding of ['trigger', 'call']) {
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

    for (const binding of this.settings.bindings.data) {
      result.push({
        documentation: binding.documentation,
        insertText: `${binding.name}${snippetPrefix}`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Property,
        label: binding.label ? (binding.label as string).replace(/'/g, this.settings.quote) : `.${binding.name}=${this.settings.quote}${this.settings.quote}`
      });
    }
  }
}
