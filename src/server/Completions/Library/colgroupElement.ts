import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class ColgroupElement extends MozDocElement {

  public documentation = `The HTML <colgroup> element defines a group of columns within a table.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup';
    this.areaRolesAllowed = false;
    this.permittedParents.push('table');

    this.attributes.set('span',
      new BindableAttribute(`This attribute contains a positive integer indicating the number of consecutive columns the <colgroup> element spans. If not present, its default value is 1.`));
  }
}
