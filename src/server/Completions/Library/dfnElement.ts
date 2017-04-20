import { BaseElement } from './_elementStructure';

export default class DfnElement extends BaseElement {

  public documentation = `The HTML <dfn> element represents the defining instance of a term.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn';
  }
}
