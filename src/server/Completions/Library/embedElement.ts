import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class EmbedElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <embed> element represents an integration point for an external application or interactive content (in other words, a plug-in).`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('height',
      new Attribute(`The displayed height of the resource, in CSS pixels.`));
    this.attributes.set('src',
      new Attribute(`The URL of the resource being embedded.`));
    this.attributes.set('type',
      new Attribute(`The MIME type to use to select the plug-in to instantiate.`));
    this.attributes.set('width',
      new Attribute(`The displayed width of the resource, in CSS pixels.`));            

    this.events = GlobalAttributes.events;
  }
}
