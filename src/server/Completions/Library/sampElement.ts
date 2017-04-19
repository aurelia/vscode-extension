import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SampElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <samp> element is an element intended to identify sample output from a 
  computer program. It is usually displayed in the browser's default monotype font (such as Lucida Console).`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
