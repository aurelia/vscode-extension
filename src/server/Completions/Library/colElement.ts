import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class ColElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('span',
      new Attribute(`This attribute contains a positive integer indicating the number of consecutive columns the <col> element spans. If not present, its default value is 1.`));

    this.events = GlobalAttributes.events;
  }
}
