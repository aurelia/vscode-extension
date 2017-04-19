import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SelectElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <select> element represents a control that provides a menu of options`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('autofocus',
      new Attribute(`This attribute lets you specify that a form control should have input focus when the page 
      loads, unless the user overrides it, for example by typing in a different control. Only one form element 
      in a document can have the autofocus attribute, which is a Boolean.`));
    this.attributes.set('disabled',
      new Attribute(`This Boolean attribute indicates that the user cannot interact with the control. If this 
      attribute is not specified, the control inherits its setting from the containing element, for example 
      fieldset; if there is no containing element with the disabled attribute set, then the control is enabled.`));
    this.attributes.set('form',
      new Attribute(`This attribute lets you specify the form element to which the select element is associated 
      (that is, its "form owner"). If this attribute is specified, its value must be the ID of a form element 
      in the same document. This enables you to place select elements anywhere within a document, not just as 
      descendants of their form elements.`));
    this.attributes.set('multiple',
      new Attribute(`This Boolean attribute indicates that multiple options can be selected in the list. If it 
      is not specified, then only one option can be selected at a time.`));
    this.attributes.set('name',
      new Attribute(`This attribute is used to specify the name of the control.`));
    this.attributes.set('required',
      new Attribute(`A Boolean attribute indicating that an option with a non-empty string value must be selected.`));
    this.attributes.set('size',
      new Attribute(`If the control is presented as a scrolled list box, this attribute represents the number of 
      rows in the list that should be visible at one time. Browsers are not required to present a select element
       as a scrolled list box. The default value is 0.`));

    this.events = GlobalAttributes.events;
  }
}
