import { BaseElement } from './_elementStructure';

export default class MarkElement extends BaseElement {

  public documentation = `The HTML <mark> element represents highlighted text, i.e., a run of text marked for 
  reference purpose, due to its relevance in a particular context. For example it can be used in a page showing 
  search results to highlight every instance of the searched-for word.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark';
  }
}
