import { MozDocElement } from './_elementStructure';

export default class BElement extends MozDocElement {

  public documentation = `The HTML <b> element represents a span of text stylistically different from normal text, 
  without conveying any special importance or relevance, and that is typically rendered in boldface.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b';
    this.permittedParents.push("html");
    this.areaRolesAllowed = false;
    this.emptyElement = true;
  }
}
