import { MozDocElement } from './_elementStructure';

export default class UElement extends MozDocElement {

  public documentation = `The HTML <u> element renders text with an underline, a line under the baseline of its content. In HTML5,
  this element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling
  the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelled.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u';

  }
}
