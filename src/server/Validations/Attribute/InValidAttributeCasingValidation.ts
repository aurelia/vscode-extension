import { Diagnostic, DiagnosticSeverity, Range, TextDocument } from 'vscode-languageserver-types';
import { AttributeDefinition, TagDefinition } from './../../DocumentParser';
import { attributeInvalidCaseFix } from './../../../shared/attributeInvalidCaseFix';

export class InValidAttributeCasingValidation {

  private fixed: string;

  public match = (attribute: AttributeDefinition, element: TagDefinition) => { 
    this.fixed = attributeInvalidCaseFix(attribute, element);
    return (this.fixed && this.fixed !== attribute.name);
  }

  public diagnostic(attribute: AttributeDefinition, element: TagDefinition, document: TextDocument) {   
    const attributeStartOffset = attribute.startOffset;
    const attributeEndOffset = attributeStartOffset + attribute.name.length;
    const original = document.getText().substring(attributeStartOffset, attributeEndOffset);

    return <Diagnostic> {
      message: `'${original}' has invalid casing; it should likely be '${this.fixed}'`,
      range: Range.create(document.positionAt(attributeStartOffset), document.positionAt(attributeEndOffset)),
      severity: DiagnosticSeverity.Error,
      source: 'Aurelia'
    };
  }
}
