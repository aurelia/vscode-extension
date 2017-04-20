import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TfootElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <tfoot> element defines a set of rows summarizing the columns of the table.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
