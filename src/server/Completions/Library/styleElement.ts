import { Attribute, BaseElement } from './_elementStructure';

export default class StyleElement extends BaseElement {

  public documentation = `The HTML <style> element contains style information for a document, or part of a 
  document. By default, the style instructions written inside that element are expected to be CSS.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style';

    this.attributes.set('type',
      new Attribute(`This attribute defines the styling language as a MIME type (charset should not be specified).
      This attribute is optional and default to text/css if it's missing.`));
    this.attributes.set('media',
      new Attribute(`This attribute defines which media the style should apply to. It's value is a media query, 
      which default to all if the attribute is missing.`));
    this.attributes.set('title',
      new Attribute(`Specifies alternative style sheet sets.`));
  }
}
