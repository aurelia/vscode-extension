import { BaseElement } from './_elementStructure';

export default class EmElement extends BaseElement {

  public documentation = `The HTML <em> element marks text that has stress emphasis. The <em> element 
  can be nested, with each level of nesting indicating a greater degree of emphasis.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em';
  }
}
