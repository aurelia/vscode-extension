import {
  CompletionItem,
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import AureliaSettings from "../AureliaSettings";

@autoinject()
export default class EmmetCompletionFactory extends BaseAttributeCompletionFactory {

  public constructor(
    public library: ElementLibrary,
    private readonly settings: AureliaSettings) {
    super(library);
  }

  public create(elementName: string): CompletionItem[] {
    const result: CompletionItem[] = [];
    const element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, [], this.settings.quote);
    }
    if (typeof element.attributes !== 'undefined') {
      this.addAttributes(element.attributes, result, [], this.settings.quote);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, [], this.settings.quote);
    }
    if (typeof element.events !== 'undefined') {
      this.addEvents(element.events, result, [], this.settings.quote);
    }

    return result;
  }
}
