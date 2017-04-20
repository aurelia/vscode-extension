import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TheadElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <thead> element defines a set of rows defining the head of the columns of the table.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}