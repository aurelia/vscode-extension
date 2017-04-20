import { Attribute, BaseElement } from './_elementStructure';

export default class ColgroupElement extends BaseElement {

  public documentation = `The HTML <colgroup> element defines a group of columns within a table.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup';
    this.attributes.set('span',
      new Attribute(`This attribute contains a positive integer indicating the number of consecutive columns the <colgroup> element spans. If not present, its default value is 1.`));
  }
}
