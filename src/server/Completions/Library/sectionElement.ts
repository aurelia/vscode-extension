import { MozDocElement } from './_elementStructure';

export default class sectionElement extends MozDocElement {

  public documentation = `The HTML <section> element represents a standalone section of functionality contained
  within an HTML document, typically with a heading, which doesn't have a more specific semantic element to represent it.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section';
  }
}
