import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class textareaElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <textarea> element represents a multi-line plain-text editing control.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('autocomplete',
      new Attribute(`This attribute indicates whether the value of the control can be automatically completed by the browser.`));
    this.attributes.set('autofocus',
      new Attribute(`This Boolean attribute lets you specify that a form control should have input focus when the page loads, 
      unless the user overrides it, for example by typing in a different control. Only one form-associated element in a document
       can have this attribute specified.`));
    this.attributes.set('cols',
      new Attribute(`The visible width of the text control, in average character widths. If it is specified, it must be a positive 
      integer. If it is not specified, the default value is 20 (HTML5).`));
    this.attributes.set('disabled',
      new Attribute(`This Boolean attribute indicates that the user cannot interact with the control. (If this attribute is not specified, 
      the control inherits its setting from the containing element, for example <fieldset>; if there is no containing element with the 
      disabled attribute set, then the control is enabled.)`));
    this.attributes.set('form',
      new Attribute(`The form element that the <textarea> element is associated with (its "form owner"). The value of the attribute must be 
      the ID of a form element in the same document. If this attribute is not specified, the <textarea> element must be a descendant of 
      a form element. This attribute enables you to place <textarea> elements anywhere within a document, not just as descendants of 
      their form elements.`));
    this.attributes.set('maxlength',
      new Attribute(`The maximum number of characters (Unicode code points) that the user can enter. If this value isn't specified, 
      the user can enter an unlimited number of characters.`));
    this.attributes.set('minlength',
      new Attribute(`The minimum number of characters (Unicode code points) required that the user should enter.`));
    this.attributes.set('name',
      new Attribute(`The name of the control.`));
    this.attributes.set('placeholder',
      new Attribute(`A hint to the user of what can be entered in the control. Carriage returns or line-feeds within the placeholder 
      text must be treated as line breaks when rendering the hint.`));
    this.attributes.set('readonly',
      new Attribute(`This Boolean attribute indicates that the user cannot modify the value of the control. Unlike the disabled attribute, 
      the readonly attribute does not prevent the user from clicking or selecting in the control. The value of a read-only control is 
      still submitted with the form.`));
    this.attributes.set('required',
      new Attribute(`This attribute specifies that the user must fill in a value before submitting a form.`));
    this.attributes.set('rows',
      new Attribute(`The number of visible text lines for the control.`));
    this.attributes.set('selectDirection',
      new Attribute(`The direction in which selection occurred. This is "forward" if the selection was made from left-to-right in an LTR locale 
      or right-to-left in an RTL locale, or "backward" if the selection was made in the opposite direction. This can be "none" if the 
      selection direction is unknown.`));
    this.attributes.set('selectionEnd',
      new Attribute(`The index to the last character in the current selection. If there's no selection, the value is the index of the character 
      following the position of the text entry cursor.`));
    this.attributes.set('selectionStart',
      new Attribute(`The index to the first character in the current selection. If there's no selection, this value is the index of the 
      character following the position of the text entry cursor.`));
    this.attributes.set('spellcheck',
      new Attribute(`Setting the value of this attribute to true indicates that the element needs to have its spelling and grammar checked. The 
      value default indicates that the element is to act according to a default behavior, possibly based on the parent element's own spellcheck 
      value. The value false indicates that the element should not be checked.`));
    this.attributes.set('wrap',
      new Attribute(`Indicates how the control wraps text.`));
      
    this.events = GlobalAttributes.events;
  }
}
