import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class VarElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <var> element represents a variable in a mathematical expression or a programming context.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
