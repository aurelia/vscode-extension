import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class UElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <u> element renders text with an underline, a line under the baseline of its content. In HTML5, 
  this element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling 
  the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelled.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
