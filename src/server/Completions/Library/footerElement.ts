import { MozDocElement } from './_elementStructure';

export default class FooterElement extends MozDocElement {

  public documentation = `The HTML <footer> element represents a footer for its nearest sectioning content 
  or sectioning root element. A footer typically contains information about the author of the section, 
  copyright data or links to related documents.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer';
  }
}
