import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class PElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <p> element represents a paragraph of text. Paragraphs are usually represented 
  in visual media as blocks of text that are separated from adjacent blocks by vertical blank space and/or first-line 
  indentation. Paragraphs are block-level elements.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
