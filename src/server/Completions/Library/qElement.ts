import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class QElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <q> element indicates that the enclosed text is a short inline quotation. This 
  element is intended for short quotations that don't require paragraph breaks; for long quotations use 
  the <blockquote> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('cite',
      new Attribute(`The value of this attribute is a URL that designates a source document or message for the 
      information quoted. This attribute is intended to point to information explaining the context or the 
      reference for the quote.`));

    this.events = GlobalAttributes.events;
  }
}
