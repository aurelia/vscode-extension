import { MozDocElement } from './_elementStructure';

export default class RpElement extends MozDocElement {

  public documentation = `The HTML <rp> element is used to provide fall-back parentheses for browsers that do not support
  display of ruby annotations using the <ruby> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp';
  }
}
