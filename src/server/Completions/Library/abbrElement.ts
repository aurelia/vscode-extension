import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class AbbrElement {

  public name = 'abbr';

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <abbr> element represents an abbreviation and optionally provides a full description for it. If present, the title attribute must contain this full description and nothing else.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('title',
      new Attribute(
        `Use the title attribute to define the full description of the abbreviation. Many user agents present this as a tooltip.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title'));

    this.events = GlobalAttributes.events;
  }
}
