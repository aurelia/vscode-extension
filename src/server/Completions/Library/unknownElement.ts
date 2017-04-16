import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class UnknownElement {

  public url = '';
  public licenceText = ``;

  public documentation = `The HTML <h1>–<h6> elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowes`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
