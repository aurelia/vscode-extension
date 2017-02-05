import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class FieldsetElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('disabled',
      new Attribute(`If this Boolean attribute is set, the form controls that are its descendants, except descendants of its first optional <legend> element, are disabled, i.e., not editable. They won't receive any browsing events, like mouse clicks or focus-related ones. Often browsers display such controls as gray.`));
    this.attributes.set('form',
      new Attribute(`This attribute has the value of the id attribute of the <form> element it's related to. Its default value is the id of the nearest <form> element it is a descendant of.`));
    this.attributes.set('name',
      new Attribute(`The name associated with the group.`));      

    this.events = GlobalAttributes.events;
  }
}
