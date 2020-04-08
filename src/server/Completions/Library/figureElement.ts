import { MozDocElement } from './_elementStructure';

export default class FigureElement extends MozDocElement {

  public documentation = `The HTML <figure> element represents self-contained content, frequently with a
  caption (<figcaption>), and is typically referenced as a single unit.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure';
    this.ariaRoles.push(...['group', 'presentation']);
  }
}
