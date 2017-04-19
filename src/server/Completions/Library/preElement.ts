import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class PreElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <pre> element represents preformatted text. Text within this element is typically displayed in a 
  non-proportional ("monospace") font exactly as it is laid out in the file. Whitespace inside this element is displayed as typed.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
