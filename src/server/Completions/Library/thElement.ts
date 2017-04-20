import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class ThElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <th> element defines a cell as header of a group of table cells. The exact nature 
  of this group is defined by the scope and headers attributes.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('colspan',
      new Attribute(`This attribute contains a positive integer value that indicates over how many columns a cell is extended. 
      Its default value is 1. If its value is set to 0, the cell is extended to the last element of the <colgroup>. Values higher 
      than 1000 are clipped down to 1000.`));
    this.attributes.set('headers',
      new Attribute(`This attribute contains a list of space-separated strings, each corresponding to the id attributes of other 
      <th> elements that relate to this element.`));
    this.attributes.set('rowspan',
      new Attribute(`This attribute contains a positive integer value that indicates over how many rows a cells is extended. Its 
      default value is 1. If its value is set to 0, the cell is extended to the last element of the table sections (<thead>, 
      <tbody> or <tfoot>). Values higher than 65534 are clipped down to 65534.`));
    this.attributes.set('scope',
      new Attribute(`This enumerated attribute defines the cells that the header (defined in the <th>) element relates to.`));            
    this.events = GlobalAttributes.events;
  }
}
