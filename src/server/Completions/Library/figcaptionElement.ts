import { MozDocElement } from './_elementStructure';

export default class FigcaptionElement extends MozDocElement {

  public documentation = `The HTML <figcaption> element represents a caption or a legend associated with a figure 
  or an illustration described by the rest of the data of the <figure> element which is its immediate ancestor.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption';
    this.permittedParents.push('figure');
    this.ariaRoles.push(...['group','presentation']);
  }
}
