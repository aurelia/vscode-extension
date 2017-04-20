import { BaseElement } from './_elementStructure';

export default class AddressElement extends BaseElement {

  public documentation = `The HTML <address> element supplies contact information for its nearest 
  <article> or <body> ancestor; in the latter case, it applies to the whole document.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address';
  }
}
