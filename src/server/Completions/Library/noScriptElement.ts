import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class NoScriptElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <noscript> element defines a section of html to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
