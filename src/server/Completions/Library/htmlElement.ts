import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class HtmlElement extends MozDocElement {

  public documentation = `The HTML <html> element represents the root (top-level element) of an HTML document, 
  so it is also referred to as the root element. All other elements must be descendants of this element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html';

    this.attributes.set('xmlns',
      new BindableAttribute(`Specifies the XML Namespace of the document. Default value is "http://www.w3.org/1999/xhtml". This is required in documents parsed with XML parsers, and optional in text/html documents.`));
  }
}
