import { Attribute, BaseElement } from './_elementStructure';

export default class AbbrElement extends BaseElement {

  public documentation = `The HTML <abbr> element represents an abbreviation and optionally provides a full description 
  for it. If present, the title attribute must contain this full description and nothing else.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr';
    this.attributes.set('title',
      new Attribute(
        `Use the title attribute to define the full description of the abbreviation. Many user agents present this as a tooltip.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title'));
  }
}
