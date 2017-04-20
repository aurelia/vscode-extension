import { Attribute, Value, Event, BaseElement } from './_elementStructure';

export default class HeaderElement extends BaseElement {
  
  public documentation = `The HTML <header> element represents a group of introductory or navigational aids. 
  It may contain some heading elements but also other elements like a logo, a search form, and so on.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header';
  }
}
