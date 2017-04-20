import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, 
  MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseCompetionFactory from './BaseCompletionFactory';

@autoinject()
export default class AureliaAttributeCompletionFactory extends BaseCompetionFactory {

  constructor(library: ElementLibrary) { super(library); }

  public create(elementName: string, existingAttributes: Array<string>): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];   
    let element = this.getElement(elementName);

    this.addAttributes(GlobalAttributes.attributes, result, existingAttributes);
    if (element.attributes) {
      this.addAttributes(element.attributes, result, existingAttributes);
    }

    this.addEvents(GlobalAttributes.events, result, existingAttributes);
    if (element.events) {
      this.addEvents(element.events, result, existingAttributes);
    }

    return result;
  }
}
