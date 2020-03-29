import { MozDocElement } from './_elementStructure';

export default class BdoElement extends MozDocElement {

  public documentation = `The HTML <bdo> element (bidirectional override) is used to override the current directionality
   of text. It causes the directionality of the characters to be ignored in favor of the specified directionality.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo';
  }
}
