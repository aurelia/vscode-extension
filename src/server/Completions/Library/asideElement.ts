import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class AsideElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <aside> element represents a section of a document with content connected tangentially to the main content of the document (often presented as a sidebar).`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('',
      new Attribute(``));

    this.events = GlobalAttributes.events;
  }
}
