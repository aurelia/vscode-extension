import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class DelElement extends MozDocElement {

  public documentation = `The HTML <del> element represents a range of text that has been deleted from a document.
  This element is often (but need not be) rendered with strike-through text.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/del';

    this.attributes.set('cite',
      new BindableAttribute(`A URI for a resource that explains the change (for example, meeting minutes).`));
    this.attributes.set('datetime',
      new BindableAttribute(`This attribute indicates the time and date of the change and must be a valid date string with an optional time. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp.`));
  }
}
