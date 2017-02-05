import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class BdoElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <bdo> element (bidirectional override) is used to override the current directionality of text. It causes the directionality of the characters to be ignored in favor of the specified directionality.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
