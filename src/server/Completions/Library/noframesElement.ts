import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class NoFramesElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noframes';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `<noframes> is an HTML element which is used to supporting browsers which are not able to support <frame> elements or configured to do so.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
