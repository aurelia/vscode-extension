import { MozDocElement } from './_elementStructure';

export default class DlElement extends MozDocElement {

  public documentation = `The HTML <dl> element encloses a list of groups of terms and descriptions.
  Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl';
    this.ariaRoles.push(...['group', 'presentation']);
    this.permittedChildren.push(...['dt', 'dd', 'script', 'template']);
  }
}
