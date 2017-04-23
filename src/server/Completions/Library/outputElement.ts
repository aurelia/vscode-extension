import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class OutputElement extends MozDocElement {

  public documentation = `The HTML <output> element represents the result of a calculation or user action.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output';
    this.attributes.set('for',
      new BindableAttribute(`A list of IDs of other elements, indicating that those elements contributed input values to (or otherwise affected) the calculation.`));
    this.attributes.set('form',
      new BindableAttribute(`
The form element that this element is associated with (its "form owner"). The value of the attribute must be an ID of a form element in the same document. If this attribute is not specified, the output element must be a descendant of a form element. This attribute enables you to place output elements anywhere within a document, not just as descendants of their form elements.`));
    this.attributes.set('name',
      new BindableAttribute(`The name of the element.`));
  }
}
