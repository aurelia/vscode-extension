import { MozDocElement } from './_elementStructure';

export default class SElement extends MozDocElement {

  public documentation = `The HTML <s> element renders text with a strikethrough, or a line through it. Use the 
  <s> element to represent things that are no longer relevant or no longer accurate. However, <s> is not 
  appropriate when indicating document edits; for that, use the <del> and <ins> elements, as appropriate.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s';

  }
}
