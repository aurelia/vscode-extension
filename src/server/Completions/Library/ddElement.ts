import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class ddElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <dd> element indicates the description of a term in a description list (<dl>).`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
