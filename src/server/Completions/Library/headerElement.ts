import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class HeaderElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <header> element represents a group of introductory or navigational aids. It may contain some heading elements but also other elements like a logo, a search form, and so on.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
