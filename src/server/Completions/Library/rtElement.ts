import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class RtElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <rt> element embraces pronunciation of characters presented in a ruby annotations, 
  which are used to describe the pronunciation of East Asian characters. This element is always used inside a <ruby> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
