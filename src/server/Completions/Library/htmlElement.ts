import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class HtmlElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <html> element represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('xmlns',
      new Attribute(`Specifies the XML Namespace of the document. Default value is "http://www.w3.org/1999/xhtml". This is required in documents parsed with XML parsers, and optional in text/html documents.`));

    this.events = GlobalAttributes.events;
  }
}
