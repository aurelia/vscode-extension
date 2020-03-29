import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class EmbedElement extends MozDocElement {

  public documentation = `The HTML <embed> element represents an integration point for an external application
  or interactive content (in other words, a plug-in).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed';
    this.emptyElement = true;
    this.ariaRoles.push(...['application', 'document', 'img', 'presentation']);


    this.attributes.set('height',
      new BindableAttribute(`The displayed height of the resource, in CSS pixels.`));
    this.attributes.set('src',
      new BindableAttribute(`The URL of the resource being embedded.`));
    this.attributes.set('type',
      new BindableAttribute(`The MIME type to use to select the plug-in to instantiate.`));
    this.attributes.set('width',
      new BindableAttribute(`The displayed width of the resource, in CSS pixels.`));
  }
}
