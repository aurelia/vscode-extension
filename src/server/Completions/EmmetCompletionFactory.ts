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
export default class EmmetCompletionFactory extends BaseCompetionFactory {

  constructor(library: ElementLibrary) { super(library); }

  public create(elementName: string): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];   
    let element = this.getElement(elementName);

    this.addAttributes(GlobalAttributes.attributes, result, []);
    if (element.attributes) {
      this.addAttributes(element.attributes, result, []);
    }

    this.addEvents(GlobalAttributes.events, result, []);
    if (element.events) {
      this.addEvents(element.events, result, []);
    }

    return result;
  }
}
