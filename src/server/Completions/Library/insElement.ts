import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class InsElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ins';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <ins> element represents a range of text that has been added to a document.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('cite',
      new Attribute(`This attribute defines the URI of a resource that explains the change, such as a link to meeting minutes or a ticket in a troubleshooting sytem.`));
    this.attributes.set('datetime',
      new Attribute(`This attribute indicates the time and date of the change and must be a valid date with an optional time string. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp.`));

    this.events = GlobalAttributes.events;
  }
}
