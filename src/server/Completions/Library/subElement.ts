import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SubElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <sub> element defines a span of text that should be displayed, for typographic 
  reasons, lower, and often smaller, than the main span of text.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
