import { AureliaApplication } from './../FileParser/Model/AureliaApplication';
import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkedString } from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import AureliaSettings from './../AureliaSettings';

@autoinject()
export default class AureliaAttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(elementName: string, existingAttributes: Array<string>, aureliaApplication: AureliaApplication): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];
    let element = this.getElement(elementName);

    this.addViewModelBindables(result, elementName, aureliaApplication);

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

  /**
   * Look at the View Model and provide all class variables as completion in kebab case.
   * TODO: Only bindables should be provided.
   * @param result
   * @param elementName
   * @param aureliaApplication
   */
  private addViewModelBindables(result: Array<CompletionItem>, elementName: string, aureliaApplication: AureliaApplication) {
    if (aureliaApplication.components) {
      aureliaApplication.components.forEach(component => {
        if (component.name !== elementName) return;
        if (!component.viewModel) return;
        if (!component.viewModel.properties) return;

        component.viewModel.properties.forEach(property => {
          const varAsKebabCase = property.name.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
          result.push({
            documentation: '',
            detail: '',
            insertText: varAsKebabCase,
            insertTextFormat: InsertTextFormat.PlainText,
            kind: CompletionItemKind.Variable,
            label: `View Model: ${varAsKebabCase}`
          });
        });
      })
    }
  }
}
