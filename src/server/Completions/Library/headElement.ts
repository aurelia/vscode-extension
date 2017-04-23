import { MozDocElement } from './_elementStructure';

export default class HeadElement extends MozDocElement {

  public documentation = `The HTML <head> element provides general information (metadata) about the document, 
  including its title and links to its scripts and style sheets.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head';
  }
}
