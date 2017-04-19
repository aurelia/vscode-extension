import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class StrongElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <strong> element gives text strong importance, and is typically displayed in bold.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
