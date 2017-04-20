import { Attribute, BaseElement } from './_elementStructure';

export default class ColElement extends BaseElement {

  public documentation = `The HTML <col> element defines a column within a table and is used for defining 
  common semantics on all common cells. It is generally found within a <colgroup> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col';
    this.attributes.set('span',
      new Attribute(`This attribute contains a positive integer indicating the number of consecutive columns the <col> element spans. If not present, its default value is 1.`));
  }
}
