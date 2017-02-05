import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class BlockquoteElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <blockquote> Element (or HTML Block Quotation Element) indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation (see Notes for how to change it). A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the <cite> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('cite',
      new Attribute(`A URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote.`));

    this.events = GlobalAttributes.events;
  }
}
