import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class sectionElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <section> element represents a standalone section of functionality contained 
  within an HTML document, typically with a heading, which doesn't have a more specific semantic element to represent it.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
