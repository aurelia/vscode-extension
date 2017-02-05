import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class DataElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <data> element links a given content with a machine-readable translation. If the content is time- or date-related, the <time> must be used.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('value',
      new Attribute(`This attribute specifies the machine-readable translation of the content of the element.`));

    this.events = GlobalAttributes.events;
  }
}
