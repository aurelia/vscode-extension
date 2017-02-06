import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class LegendElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <legend> element represents a caption for the content of its parent <fieldset>.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
