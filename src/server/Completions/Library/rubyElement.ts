import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class RubyElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <ruby> element represents a ruby annotation. Ruby annotations are for 
  showing pronunciation of East Asian characters.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
