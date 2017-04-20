import { BaseElement } from './_elementStructure';

export default class UlElement extends BaseElement {

  public documentation = `The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul';
  }
}
