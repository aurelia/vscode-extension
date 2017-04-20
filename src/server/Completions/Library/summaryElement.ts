import { BaseElement } from './_elementStructure';

export default class SummaryElement extends BaseElement {

  public documentation = `The HTML <summary> element is used as a summary, caption, or legend for the content of a <details> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary';
  }
}
