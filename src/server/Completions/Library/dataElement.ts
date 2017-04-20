import { Attribute, BaseElement } from './_elementStructure';

export default class DataElement extends BaseElement {

  public documentation = `The HTML <data> element links a given content with a machine-readable translation. 
  If the content is time- or date-related, the <time> must be used.`;

  constructor() {
    super();
    this. url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data';
    this.attributes.set('value',
      new Attribute(`This attribute specifies the machine-readable translation of the content of the element.`));
  }
}
