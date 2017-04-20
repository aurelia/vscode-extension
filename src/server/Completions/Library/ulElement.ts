import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class UlElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
