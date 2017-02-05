import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class DetailsElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <details> element is used as a disclosure widget from which the user can retrieve additional information.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('open',
      new Attribute(`This Boolean attribute indicates whether the details will be shown to the user on page load. Default is false and so details will be hidden.`));

    this.events = GlobalAttributes.events;
  }
}
