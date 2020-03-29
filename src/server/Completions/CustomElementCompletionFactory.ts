import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat, MarkedString
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import { AureliaApplication } from "../FileParser/Model/AureliaApplication";
import ElementLibrary from './Library/_elementLibrary';

/**
 * Get all the Custom elements from (based on aureliaApplication), and provide completion
 */
@autoinject()
export default class CustomElementCompletionFactory {

  constructor(private readonly library: ElementLibrary) { }

  public create(parent: string, aureliaApplication: AureliaApplication): CompletionItem[] {

    const result: CompletionItem[] = [];

    // Assumption: Every custom element has a script and a template
    const customElements = aureliaApplication.components.filter(component => component.paths.length >= 2);
    customElements.forEach(element => {
      result.push({
        documentation: MarkedString.fromPlainText(`${element.name}`).toString(),
        detail: `Custom Element`,
        insertText: `${element.name}$2>$1</${element.name}>$0`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Property,
        label: `Custom Element: ${element.name}`,
      });
    });

    return result;
  }
}
