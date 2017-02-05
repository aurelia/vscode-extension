import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class DfnElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <dfn> element represents the defining instance of a term.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
