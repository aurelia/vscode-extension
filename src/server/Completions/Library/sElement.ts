import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <s> element renders text with a strikethrough, or a line through it. Use the 
  <s> element to represent things that are no longer relevant or no longer accurate. However, <s> is not 
  appropriate when indicating document edits; for that, use the <del> and <ins> elements, as appropriate.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
