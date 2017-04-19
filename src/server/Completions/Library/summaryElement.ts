import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SummaryElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <summary> element is used as a summary, caption, or legend for the content of a <details> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
