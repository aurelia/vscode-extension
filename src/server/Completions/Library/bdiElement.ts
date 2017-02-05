import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class BdiElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <bdi> element (bidirectional isolation) isolates a span of text that might be formatted in a different direction from other text outside it.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
