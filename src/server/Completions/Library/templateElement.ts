import { MozDocElement } from './_elementStructure';

export default class TemplateElement extends MozDocElement {

  public documentation = `The HTML <template> element is a mechanism for holding client-side content that is
  not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript. `;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template';
  }
}
