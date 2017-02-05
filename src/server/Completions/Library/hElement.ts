import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class HElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <h1>–<h6> elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowes`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
