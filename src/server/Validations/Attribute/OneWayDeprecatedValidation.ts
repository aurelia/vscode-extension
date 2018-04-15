import { Diagnostic, DiagnosticSeverity, Range, TextDocument } from 'vscode-languageserver';
import {AttributeDefinition, TagDefinition } from './../../FileParser/HTMLDocumentParser';

export class OneWayDeprecatedValidation {
  public match(attribute: AttributeDefinition) {
    return attribute.binding === 'one-way';
  }

  public diagnostic(attribute: AttributeDefinition, element: TagDefinition, document: TextDocument) {   
    const bindingStartOffset = attribute.startOffset + attribute.name.length + 1;
    const bindingEndOffset = bindingStartOffset + attribute.binding.length;
    return <Diagnostic> {
      message: `attribute '${attribute.name}' is using one-way data binding which is deprecated, use 'to-view'`,
      range: Range.create(document.positionAt(bindingStartOffset), document.positionAt(bindingEndOffset)),
      severity: DiagnosticSeverity.Warning,
      source: 'Aurelia',
      code: 'aurelia-binding-one-way-deprecated'
    };
  }
}
