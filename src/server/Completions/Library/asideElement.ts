import { MozDocElement } from './_elementStructure';

export default class AsideElement extends MozDocElement {

  public documentation = `The HTML <aside> element represents a section of a document with content connected
  tangentially to the main content of the document (often presented as a sidebar).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside';
    this.ariaRoles.push(...['feed', 'note', 'presentation', 'region', 'search']);
  }
}
