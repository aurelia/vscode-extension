import { MozDocElement } from './_elementStructure';

export default class TableElement extends MozDocElement {

  public documentation = `The HTML <table> element represents tabular data —that is, information expressed via a two-dimensional data table.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table';
  }
}
