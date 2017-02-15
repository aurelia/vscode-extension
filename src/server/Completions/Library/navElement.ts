import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class NavElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <nav> element represents a section of a page that links to other pages or to parts within the page: a section with navigation links.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
