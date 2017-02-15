import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class _Element {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = ``;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('disabled',
      new Attribute(`If this Boolean attribute is set, none of the items in this option group is selectable. Often browsers grey out such control and it won't receive any browsing events, like mouse clicks or focus-related ones.`));
    this.attributes.set('label',
      new Attribute(`The name of the group of options, which the browser can use when labeling the options in the user interface. This attribute is mandatory if this element is used.`));

    this.events = GlobalAttributes.events;
  }
}
