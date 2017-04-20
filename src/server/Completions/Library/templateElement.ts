import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TemplateElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <template> element is a mechanism for holding client-side content that is 
  not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript. `;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
