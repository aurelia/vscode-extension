import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TrElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <tr> element defines a row of cells in a table. Those can be a mix of <td> and <th> elements.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
