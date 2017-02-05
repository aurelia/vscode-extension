import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class _Element {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/_';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = ``;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('',
      new Attribute(``));

    this.events = GlobalAttributes.events;
  }
}
