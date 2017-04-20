import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TableElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <table> element represents tabular data —that is, information expressed via a two-dimensional data table.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
