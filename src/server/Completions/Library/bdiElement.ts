import { MozDocElement } from './_elementStructure';

export default class BdiElement extends MozDocElement {

  public documentation = `The HTML <bdi> element (bidirectional isolation) isolates a span of text that might 
  be formatted in a different direction from other text outside it.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi';
  }
}
