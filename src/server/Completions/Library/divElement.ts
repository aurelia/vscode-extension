import { BaseElement } from './_elementStructure';

export default class DivElement extends BaseElement {

  public documentation = `The HTML <div> element is the generic container for flow content and does not inherently 
  represent anything. Use it to group elements for purposes such as styling (using the class or id attributes), 
  marking a section of a document in a different language (using the lang attribute), and so on.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div';
  }
}
