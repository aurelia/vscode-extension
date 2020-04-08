import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class TdElement extends MozDocElement {

  public documentation = `The HTML <td> element defines a cell of a table that contains data. It participates in the table model.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td';

    this.attributes.set('colspan',
      new BindableAttribute(`This attribute contains a non-negative integer value that indicates for how many columns the cell extends. Its default
      value is 1. Values higher than 1000 will be considered as incorrect and will be set to the default value (1).`));
    this.attributes.set('headers',
      new BindableAttribute(`This attribute contains a list of space-separated strings, each corresponding to the id attribute of the <th> elements
      that apply to this element.`));
    this.attributes.set('rowspan',
      new BindableAttribute(`This attribute contains a non-negative integer value that indicates for how many rows the cell extends. Its default
      value is 1; if its value is set to 0, it extends until the end of the table section (<thead>, <tbody>, <tfoot>, even if implicitly
      defined, that the cell belongs to. Values higher than 65534 are clipped down to 65534.`));
  }
}
