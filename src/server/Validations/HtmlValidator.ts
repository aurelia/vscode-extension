import { Diagnostic, TextDocument } from 'vscode-languageserver';
import { HTMLDocumentParser } from "../FileParser/HTMLDocumentParser";
import { autoinject } from 'aurelia-dependency-injection';

import { OneWayDeprecatedValidation } from './Attribute/OneWayDeprecatedValidation';
import { InValidAttributeCasingValidation } from './Attribute/InValidAttributeCasingValidation';
import AureliaSettings from '../AureliaSettings';

@autoinject()
export class HtmlValidator {
  private readonly validationEnabled: boolean;

  private readonly attributeValidators: (
    OneWayDeprecatedValidation | InValidAttributeCasingValidation)[]
    = [];

  public constructor(
    oneWayDeprecatedValidation: OneWayDeprecatedValidation,
    inValidAttributeCasingValidation: InValidAttributeCasingValidation,
    private readonly settings: AureliaSettings) {

    this.attributeValidators.push(
      oneWayDeprecatedValidation,
      inValidAttributeCasingValidation
    );
  }

  public async doValidation(document: TextDocument): Promise<Diagnostic[]> {

    if (!this.settings.validation) {
      return Promise.resolve([]);
    }

    const text = document.getText();
    if (text.trim().length === 0) {
      return Promise.resolve([]);
    }

    const parser = new HTMLDocumentParser();
    const documentNodes = await parser.parse(text);

    const diagnostics: Diagnostic[] = [];
    for (const element of documentNodes) {
      for (const attribute of element.attributes) {
        this.attributeValidators
          .filter(validator => validator.match(attribute, element, document))
          .forEach(validator => diagnostics.push(validator.diagnostic(attribute, element, document)));
      }
    }

    return Promise.resolve(diagnostics);
  }
}

