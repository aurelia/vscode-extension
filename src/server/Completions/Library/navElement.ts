import { BaseElement } from './_elementStructure';

export default class NavElement extends BaseElement {

  public documentation = `The HTML <nav> element represents a section of a page that links to other pages or to 
  parts within the page: a section with navigation links.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav';
  }
}
