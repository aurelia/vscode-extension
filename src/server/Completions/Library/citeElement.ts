import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class CiteElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <cite> element represents a reference to a creative work. It must include the title of a work or a URL reference, which may be in an abbreviated form according to the conventions used for the addition of citation metadata.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
