import { MozDocElement } from './_elementStructure';

export default class SmallElement extends MozDocElement {

  public documentation = `The HTML <small> element makes the text font size one size smaller (for example, from 
  large to medium, or from small to x-small) down to the browser's minimum font size.  In HTML5, this element 
  is repurposed to represent side-comments and small print, including copyright and legal text, independent 
  of its styled presentation.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small';
  }
}
