import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class WbrElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <wbr> element represents a word break opportunity—a position within text 
  where the browser may optionally break a line, though its line-breaking rules would not otherwise create a 
  break at that location.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
