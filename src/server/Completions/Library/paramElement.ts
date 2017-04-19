import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class ParamElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <param> element defines parameters for an <object> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('name',
      new Attribute(`Name of the parameter.`));
    this.attributes.set('value',
      new Attribute(`Specifies the value of the parameter.`));

    this.events = GlobalAttributes.events;
  }
}
