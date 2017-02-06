import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class LabelElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <label> element represents a caption for an item in a user interface.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('for',
      new Attribute(`The ID of a labelable form-related element in the same document as the label element. The first such element in the document with an ID matching the value of the for attribute is the labeled control for this label element.`));
    
    this.events = GlobalAttributes.events;
  }
}
