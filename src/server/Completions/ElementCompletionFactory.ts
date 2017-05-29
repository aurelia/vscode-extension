import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { MozDocElement } from './Library/_elementStructure';

@autoinject()
export default class ElementCompletionFactory {

  constructor(private library: ElementLibrary) { }

  public create(parent: string): Array<CompletionItem> {

    let result: Array<CompletionItem> = [];

    if (parent) {
      let parentElementDef = <MozDocElement> this.library.elements[parent];
      if (parentElementDef && parentElementDef.permittedChildren && parentElementDef.permittedChildren.length) {
        for(let childName of parentElementDef.permittedChildren) {
          result.push({
            documentation: MarkedString.fromPlainText(this.library.elements[childName].documentation).toString(),
            detail: 'HTMLElement',
            insertText: childName + '>',
            insertTextFormat: InsertTextFormat.PlainText,
            kind: CompletionItemKind.Property,
            label: `<${childName}>`,
            filterText: `${childName}>`
          });
        }
        return result;
      }
    }

    for(let name in this.library.elements) {
      let item = this.library.elements[name];
      // if (item instanceof MozDocElement && item.permittedParents.length) {
      //   continue;
      // }
      result.push({
        documentation: MarkedString.fromPlainText(item.documentation).toString(),
        detail: 'HTMLElement',
        insertText: name + '>',
        insertTextFormat: InsertTextFormat.PlainText,
        kind: CompletionItemKind.Property,
        label: `<${name}>`,
        filterText: `${name}>`
      });
    }

    return result;
  }
}
