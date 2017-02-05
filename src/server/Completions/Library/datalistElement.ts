import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class DataListElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <datalist> element contains a set of <option> elements that represent the values available for other controls.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
