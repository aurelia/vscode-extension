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
export default class AureliaAttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary) { super(library); }

  public create(elementName: string, existingAttributes: Array<string>): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];   
    let element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, existingAttributes);
    }

    if (element.attributes) {
      this.addAttributes(element.attributes, result, existingAttributes);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, existingAttributes);
    }
    
    if (element.events) {
      this.addEvents(element.events, result, existingAttributes);
    }

    return result;
  }
}
