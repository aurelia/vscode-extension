import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SlotElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <slot> element is a placeholder inside a web component that you can fill 
  with your own markup, with the effect of composing different DOM trees together. A named slot is a <slot> element with a name attribute.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('name',
      new Attribute(`The slot's name.`));

    this.events = GlobalAttributes.events;
  }
}
