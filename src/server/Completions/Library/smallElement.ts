import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SmallElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <small> element makes the text font size one size smaller (for example, from 
  large to medium, or from small to x-small) down to the browser's minimum font size.  In HTML5, this element 
  is repurposed to represent side-comments and small print, including copyright and legal text, independent 
  of its styled presentation.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
