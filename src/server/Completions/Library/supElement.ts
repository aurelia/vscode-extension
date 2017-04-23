import { MozDocElement } from './_elementStructure';

export default class SupElement extends MozDocElement {

  public documentation = `The HTML <sup> element defines a span of text that should be displayed, for typographic 
  reasons, higher, and often smaller, than the main span of text.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup';
  }
}
