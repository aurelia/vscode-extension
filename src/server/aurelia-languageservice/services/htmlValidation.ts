'use strict';
import { Diagnostic, DiagnosticSeverity, Range, TextDocument } from 'vscode-languageserver-types';
import { LanguageSettings } from '../aureliaLanguageService';
import { HTMLDocument } from '../parser/htmlParser';
import { TokenType, createScanner } from '../parser/htmlScanner';
import { attributeInvalidCaseFix } from './../../../shared/attributeInvalidCaseFix';

export type DiagnosticCodes = 'invalid-casing' | 'invalid-method';
export const DiagnosticCodes = {
  InvalidCasing: 'invalid-casing' as DiagnosticCodes,
  InvalidMethod: 'invalid-method' as DiagnosticCodes,
};

export const DiagnosticSource = 'Aurelia';

interface Attribute {
  name: string;
  start: number;
  length: number;
  value?: string;
}

export class HTMLValidation {
  private validationEnabled: boolean;

  constructor() {
    this.validationEnabled = true
  }

  public configure(raw: LanguageSettings) {
    if (raw) {
      this.validationEnabled = raw.validate;
    }
  }

  public async doValidation(document: TextDocument, htmlDocument: HTMLDocument): Promise<Diagnostic[]> {
    if (!this.validationEnabled) {
      return Promise.resolve([]);
    }

    // handle empty document cases
    if (!htmlDocument || !htmlDocument.roots || htmlDocument.roots.length === 0) {
      return Promise.resolve([]);
    }

    const text = document.getText();
    const scanner = createScanner(text, htmlDocument.roots[0].start);
    const diagnostics: Diagnostic[] = [];

    let attr;
    let token = scanner.scan();
    let elementName = '';
    while (token !== TokenType.EOS) {
      // tslint:disable-next-line:switch-default
      switch (token) {
        case TokenType.AttributeName:
          attr = <Attribute> {
            length: scanner.getTokenLength(),
            name: scanner.getTokenText(),
            start: scanner.getTokenOffset(),
          };
          break;
        case TokenType.AttributeValue:
          attr.value = scanner.getTokenText();
          this.validateAttribute(attr, elementName, document, diagnostics);
          break;
        case TokenType.StartTag:
          elementName = scanner.getTokenText();
          break;
      }
      token = scanner.scan();
    }

    return Promise.resolve(diagnostics);
  }

  private validateAttribute(attr: Attribute, elementName: string, document: TextDocument, diagnostics: Diagnostic[]) {
    const {attribute, command, fixed} = attributeInvalidCaseFix(elementName, attr.name);
    if(fixed && fixed !== attribute) {
      diagnostics.push(this.toDiagnostic(attr, document,
        `'${attr.name}' has invalid casing; it should likely be '${fixed}.${command}'`,
        DiagnosticCodes.InvalidCasing));
    }
  }

  private toDiagnostic(
    attr: Attribute,
    document: TextDocument,
    message: string,
    code: DiagnosticCodes | undefined = undefined,
    serverity: DiagnosticSeverity = DiagnosticSeverity.Error): Diagnostic {
      const range = Range.create(document.positionAt(attr.start), document.positionAt(attr.start + attr.length));
      const diagnostic = <Diagnostic> {
        message: message,
        range: range,
        severity: serverity,
        source: DiagnosticSource,
      };

      if (code !== undefined) {
        diagnostic.code = code;
      }
      return diagnostic;
  }
}
