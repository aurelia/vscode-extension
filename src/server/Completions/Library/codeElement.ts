import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class codeElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <code> element represents a fragment of computer code. By default, it is displayed in the browser's default monospace font.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
