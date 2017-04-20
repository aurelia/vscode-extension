import { BaseElement } from './_elementStructure';

export default class ddElement extends BaseElement {

  public documentation = `The HTML <dd> element indicates the description of a term in a description list (<dl>).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd';
  }
}
