import { MozDocElement } from './_elementStructure';

export default class AddressElement extends MozDocElement {

  public documentation = `The HTML <address> element supplies contact information for its nearest 
  <article> or <body> ancestor; in the latter case, it applies to the whole document.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address';
    this.areaRolesAllowed = false;
    this.notPermittedChildren.push(...['hgroup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'aside', 'section', 'nav', 'header', 'footer']);
  }
}
