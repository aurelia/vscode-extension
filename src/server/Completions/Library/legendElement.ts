import { BaseElement } from './_elementStructure';

export default class LegendElement extends BaseElement{

  public documentation = `The HTML <legend> element represents a caption for the content of its parent <fieldset>.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend';
  }
}
