import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class BElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Elementb_';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <b> element represents a span of text stylistically different from normal text, without conveying any special importance or relevance, and that is typically rendered in boldface.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
