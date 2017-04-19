import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class RpElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <rp> element is used to provide fall-back parentheses for browsers that do not support 
  display of ruby annotations using the <ruby> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
