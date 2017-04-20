import { BaseElement } from './_elementStructure';

export default class DtElement extends BaseElement {

  public documentation = `The HTML <dt> element identifies a term in a description list. This element can occur 
  only as a child element of a <dl>. It is usually followed by a <dd> element; however, multiple <dt> elements in 
  a row indicate several terms that are all defined by the immediate next <dd> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt';
  }
}
