import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat, 
  MarkedString } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import AureliaSettings from './../AureliaSettings';

@autoinject()
export default class AureliaAttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(elementName: string, existingAttributes: Array<string>): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];   
    let element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, existingAttributes, this.settings.quote);
    }

    if (element.attributes) {
      this.addAttributes(element.attributes, result, existingAttributes, this.settings.quote);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, existingAttributes, this.settings.quote);
    }
    
    if (element.events) {
      this.addEvents(element.events, result, existingAttributes, this.settings.quote);
    }

    return result;
  }
}
