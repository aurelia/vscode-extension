import { MozDocElement } from './_elementStructure';

export default class SubElement extends MozDocElement {

  public documentation = `The HTML <sub> element defines a span of text that should be displayed, for typographic
  reasons, lower, and often smaller, than the main span of text.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub';
  }
}
