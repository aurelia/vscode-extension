import { Attribute, BaseElement } from './_elementStructure';

export default class EmbedElement extends BaseElement {

  public documentation = `The HTML <embed> element represents an integration point for an external application 
  or interactive content (in other words, a plug-in).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed';
    this.attributes.set('height',
      new Attribute(`The displayed height of the resource, in CSS pixels.`));
    this.attributes.set('src',
      new Attribute(`The URL of the resource being embedded.`));
    this.attributes.set('type',
      new Attribute(`The MIME type to use to select the plug-in to instantiate.`));
    this.attributes.set('width',
      new Attribute(`The displayed width of the resource, in CSS pixels.`));            
  }
}
