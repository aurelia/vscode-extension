import { MozDocElement } from './_elementStructure';

export default class DataListElement extends MozDocElement {

  public documentation = `The HTML <datalist> element contains a set of <option> elements that represent
  the values available for other controls.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist';
    this.areaRolesAllowed = false;
  }
}
