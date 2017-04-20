import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TBodyElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <tbody> element groups one or more <tr> elements as the body of a <table> element.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
