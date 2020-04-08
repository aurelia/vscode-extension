import { MozDocElement } from './_elementStructure';

export default class StrongElement extends MozDocElement {

  public documentation = `The HTML <strong> element gives text strong importance, and is typically displayed in bold.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong';
  }
}
