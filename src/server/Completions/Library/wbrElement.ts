import { MozDocElement } from './_elementStructure';

export default class WbrElement extends MozDocElement {

  public documentation = `The HTML <wbr> element represents a word break opportunity—a position within text
  where the browser may optionally break a line, though its line-breaking rules would not otherwise create a
  break at that location.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr';
  }
}
