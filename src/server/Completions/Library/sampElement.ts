import { BaseElement } from './_elementStructure';

export default class SampElement extends BaseElement {

  public documentation = `The HTML <samp> element is an element intended to identify sample output from a 
  computer program. It is usually displayed in the browser's default monotype font (such as Lucida Console).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp';
  }
}
