import { MozDocElement } from './_elementStructure';

export default class VarElement extends MozDocElement {

  public documentation = `The HTML <var> element represents a variable in a mathematical expression or a programming context.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var';
  }
}
