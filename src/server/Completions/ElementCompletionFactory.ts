import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat, MarkedString
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { MozDocElement } from './Library/_elementStructure';

@autoinject()
export default class ElementCompletionFactory {

  constructor(private readonly library: ElementLibrary) { }

  public create(parent: string): CompletionItem[] {

    const result: CompletionItem[] = [];

    if (parent) {
      const parentElementDef = <MozDocElement> this.library.elements[parent];
      if (parentElementDef?.permittedChildren?.length) {
        for (const childName of parentElementDef.permittedChildren) {
          result.push({
            documentation: MarkedString.fromPlainText(this.library.elements[childName].documentation).toString(),
            detail: 'HTMLElement',
            insertText: `${childName  }>`,
            insertTextFormat: InsertTextFormat.PlainText,
            kind: CompletionItemKind.Property,
            label: `<${childName}>`,
            filterText: `${childName}>`
          });
        }
        return result;
      }
    }

    for (const name in this.library.elements) {
      const item = this.library.elements[name];
      // if (item instanceof MozDocElement && item.permittedParents.length) {
      //   continue;
      // }
      result.push({
        documentation: MarkedString.fromPlainText(item.documentation).toString(),
        detail: 'HTMLElement',
        insertText: `${name  }>`,
        insertTextFormat: InsertTextFormat.PlainText,
        kind: CompletionItemKind.Property,
        label: `<${name}>`,
        filterText: `${name}>`
      });
    }

    return result;
  }
}
