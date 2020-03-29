import { MozDocElement } from './_elementStructure';

export default class BrElement extends MozDocElement {

  public documentation = `The HTML <br> element produces a line break in text (carriage-return). It is useful for writing
  a poem or an address, where the division of lines is significant.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br';
    this.emptyElement = true;
  }
}
