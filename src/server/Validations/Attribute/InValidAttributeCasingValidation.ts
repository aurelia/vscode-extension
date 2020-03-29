import { Diagnostic, DiagnosticSeverity, Range, TextDocument } from 'vscode-languageserver';
import { AttributeDefinition, TagDefinition } from "../../FileParser/HTMLDocumentParser";
import { attributeInvalidCaseFix } from "../../Common/AttributeInvalidCaseFix";
import { unescape } from 'querystring';

export class InValidAttributeCasingValidation {

  private fixed: string;
  private original: string;

  private attributeStartOffset: number;
  private attributeEndOffset: number;

  public match = (attribute: AttributeDefinition, element: TagDefinition, document: TextDocument) => {

    if (!attribute.binding) {
      this.attributeEndOffset = undefined;
      this.attributeStartOffset = undefined;
      this.original = undefined;
      this.fixed = undefined;
      return false;
    }

    this.attributeStartOffset = attribute.startOffset;
    this.attributeEndOffset = this.attributeStartOffset + attribute.name.length;

    this.fixed = attributeInvalidCaseFix(attribute.name, element.name);
    this.original = document.getText().substring(this.attributeStartOffset, this.attributeEndOffset);

    return (this.fixed && this.fixed !== this.original);
  };

  public diagnostic(attribute: AttributeDefinition, element: TagDefinition, document: TextDocument) {

    const attributeStartOffset = attribute.startOffset;
    const attributeEndOffset = attributeStartOffset + attribute.name.length;
    return <Diagnostic> {
      message: `'${this.original}' has invalid casing; it should likely be '${this.fixed}'`,
      range: Range.create(document.positionAt(attributeStartOffset), document.positionAt(attributeEndOffset)),
      severity: DiagnosticSeverity.Error,
      source: 'Aurelia',
      code: 'aurelia-attribute-invalid-case',
      elementName: element.name
    };
  }
}
