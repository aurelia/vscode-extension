import { BaseElement } from './_elementStructure';

export default class HElement extends BaseElement {

  public documentation = `The HTML <h1>–<h6> elements represent six levels of section headings. 
  <h1> is the highest section level and <h6> is the lowes`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements';
  }
}
