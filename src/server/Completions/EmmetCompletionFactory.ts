import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, 
  MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';

@autoinject()
export default class EmmetCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary) { super(library); }

  public create(elementName: string): Array<CompletionItem> {
    let result:Array<CompletionItem> = [];   
    let element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, []);
    }
    if (element.attributes) {
      this.addAttributes(element.attributes, result, []);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, []);
    }
    if (element.events) {
      this.addEvents(element.events, result, []);
    }

    return result;
  }
}
