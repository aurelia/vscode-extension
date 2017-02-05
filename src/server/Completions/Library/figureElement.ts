import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class FigureElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <figure> element represents self-contained content, frequently with a caption (<figcaption>), and is typically referenced as a single unit.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
