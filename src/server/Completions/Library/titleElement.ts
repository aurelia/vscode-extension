import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TitleElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <title> element defines the title of the document, shown in a browser's title bar or
   on the page's tab. It can only contain text, and any contained tags are ignored.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
