import { MozDocElement } from './_elementStructure';

export default class PElement extends MozDocElement {

  public documentation = `The HTML <p> element represents a paragraph of text. Paragraphs are usually represented
  in visual media as blocks of text that are separated from adjacent blocks by vertical blank space and/or first-line
  indentation. Paragraphs are block-level elements.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p';
  }
}
