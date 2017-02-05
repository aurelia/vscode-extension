import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class HeadElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <head> element provides general information (metadata) about the document, including its title and links to its scripts and style sheets.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
