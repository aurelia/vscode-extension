import { MozDocElement } from './_elementStructure';

export default class PreElement extends MozDocElement {

  public documentation = `The HTML <pre> element represents preformatted text. Text within this element is typically displayed in a 
  non-proportional ("monospace") font exactly as it is laid out in the file. Whitespace inside this element is displayed as typed.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre';
  }
}
