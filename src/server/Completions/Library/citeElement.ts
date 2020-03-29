import { MozDocElement } from './_elementStructure';

export default class CiteElement extends MozDocElement {

  public documentation = `The HTML <cite> element represents a reference to a creative work. It must include the title
  of a work or a URL reference, which may be in an abbreviated form according to the conventions used for the addition
  of citation metadata.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite';
  }
}
