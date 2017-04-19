import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SupElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <sup> element defines a span of text that should be displayed, for typographic 
  reasons, higher, and often smaller, than the main span of text.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
