import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class LabelElement extends MozDocElement {

  public documentation = `The HTML <label> element represents a caption for an item in a user interface.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label';

    this.attributes.set('for',
      new BindableAttribute(`The ID of a labelable form-related element in the same document as the label element. The first such element in the document with an ID matching the value of the for attribute is the labeled control for this label element.`));
  }
}
