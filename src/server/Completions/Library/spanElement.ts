import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SpanElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <span> element is a generic inline container for phrasing content, which does 
  not inherently represent anything. It can be used to group elements for styling purposes (using the class or 
  id attributes), or because they share attribute values, such as lang. It should be used only when no other 
  semantic element is appropriate. <span> is very much like a <div> element, but <div> is a block-level element 
  whereas a <span> is an inline element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
