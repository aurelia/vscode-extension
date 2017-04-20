import { BaseElement } from './_elementStructure';

export default class DataListElement extends BaseElement {

  public documentation = `The HTML <datalist> element contains a set of <option> elements that represent 
  the values available for other controls.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist';
  }
}
