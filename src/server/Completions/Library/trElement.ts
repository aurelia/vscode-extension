import { MozDocElement } from './_elementStructure';

export default class TrElement extends MozDocElement {

  public documentation = `The HTML <tr> element defines a row of cells in a table. Those can be a mix of <td> and 
  <th> elements.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr';

  }
}
