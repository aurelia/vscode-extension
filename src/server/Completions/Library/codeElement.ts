import { MozDocElement } from './_elementStructure';

export default class codeElement extends MozDocElement {

  public documentation = `The HTML <code> element represents a fragment of computer code. By default, 
  it is displayed in the browser's default monospace font.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code';
  }
}
