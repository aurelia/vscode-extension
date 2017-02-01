import { Attribute, Value } from './elementStructure';

export default class AbbrElement {

  public name = 'abbr';

  public documentation = `The HTML <abbr> element represents an abbreviation and optionally provides a full description for it. If present, the title attribute must contain this full description and nothing else.`;

  public attributes: Map<string, Attribute> = new Map([
      [
        'title',
        new Attribute(`Use the title attribute to define the full description of the abbreviation. Many user agents present this as a tooltip.`)
      ]
  ]);
}
