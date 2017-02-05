import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class DelElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/del';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <del> element represents a range of text that has been deleted from a document. This element is often (but need not be) rendered with strike-through text.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('cite',
      new Attribute(`A URI for a resource that explains the change (for example, meeting minutes).`));
    this.attributes.set('datetime',
      new Attribute(`This attribute indicates the time and date of the change and must be a valid date string with an optional time. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp.`));

    this.events = GlobalAttributes.events;
  }
}
