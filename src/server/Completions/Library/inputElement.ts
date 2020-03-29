import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class InputElement extends MozDocElement {

  public documentation = `The HTML <input> element is used to create interactive controls for web-based forms in
  order to accept data from the user. How an <input> works varies considerably depending on the value of its
  type attribute.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input';

    this.attributes.set('type',
      new BindableAttribute('The type of control to display. The default type is text, if this attribute is not specified.',
        null,
        null,
        null,
        null,
        new Map([
          ['button', new Value(`A push button with no default behavior.`)],
          ['checkbox', new Value(`A check box. You must use the value attribute to define the value submitted by this item. Use the checked attribute to indicate whether this item is selected. You can also use the indeterminate attribute (which can only be set programmatically) to indicate that the checkbox is in an indeterminate state (on most platforms, this draws a horizontal line across the checkbox).`)],
          ['color', new Value(`HTML5 A control for specifying a color. A color picker's UI has no required features other than accepting simple colors as text (more info).`)],
          ['date', new Value(`HTML5 A control for entering a date (year, month, and day, with no time).`)],
          ['datetime-local', new Value(`HTML5 A control for entering a date and time, with no time zone.`)],
          ['email', new Value(`HTML5 A field for editing an e-mail address. The input value is validated to contain either the empty string or a single valid e-mail address before submitting. The :valid and :invalid CSS pseudo-classes are applied as appropriate.`)],
          ['file', new Value(`A control that lets the user select a file. Use the accept attribute to define the types of files that the control can select.`)],
          ['hidden', new Value(`A control that is not displayed but whose value is submitted to the server.`)],
          ['image', new Value(`A graphical submit button. You must use the src attribute to define the source of the image and the alt attribute to define alternative text. You can use the height and width attributes to define the size of the image in pixels.`)],
          ['month', new Value(`A control for entering a month and year, with no time zone.`)],
          ['number', new Value(`A control for entering a floating point number.`)],
          ['password', new Value(`A single-line text field whose value is obscured. Use the maxlength attribute to specify the maximum length of the value that can be entered.`)],
          ['radio', new Value(`A radio button. You must use the value attribute to define the value submitted by this item. Use the checked attribute to indicate whether this item is selected by default. Radio buttons that have the same value for the name attribute are in the same \"radio button group\". Only one radio button in a group can be selected at a time.`)],
          ['range', new Value(`A control for entering a number whose exact value is not important. This type control uses the following default values if the corresponding attributes are not specified:\n   \n    min: 0\n    max: 100\n    value: min + (max - min) / 2, or min if max is less than min\n    step: 1\n   \n`)],
          ['reset', new Value(`A button that resets the contents of the form to default values.`)],
          ['search', new Value(`A single-line text field for entering search strings. Line-breaks are automatically removed from the input value.`)],
          ['submit', new Value(`A button that submits the form.`)],
          ['tel', new Value(`A control for entering a telephone number. Line-breaks are automatically removed from the input value, but no other syntax is enforced. You can use attributes such as pattern and maxlength to restrict values entered in the control. The :valid and :invalid CSS pseudo-classes are applied as appropriate.`)],
          ['text', new Value(`A single-line text field. Line-breaks are automatically removed from the input value.`)],
          ['time', new Value(`A control for entering a time value with no time zone.`)],
          ['url', new Value(`A field for editing a URL. The input value is validated to contain either the empty string or a valid absolute URL before submitting. Line-breaks and leading or trailing whitespace are automatically removed from the input value. You can use attributes such as pattern and maxlength to restrict values entered in the control. The :valid and :invalid CSS pseudo-classes are applied as appropriate.`)],
          ['week', new Value(`A control for entering a date consisting of a week-year number and a week number with no time zone.`)]
        ])));
    this.attributes.set('accept',
      new BindableAttribute(`If the value of the type attribute is file, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored.`));
    this.attributes.set('autocomplete',
      new BindableAttribute(`This attribute indicates whether the value of the control can be automatically completed by the browser.`,
        null,
        null,
        null,
        null,
        new Map([
          ['off', new Value(`The user must explicitly enter a value into this field for every use, or the document provides its own auto-completion method. The browser does not automatically complete the entry.`)],
          ['on', new Value(`The browser is allowed to automatically complete the value based on values that the user has entered during previous uses, however on does not provide any further information about what kind of data the user might be expected to enter.`)],
          ['name', new Value(`Full name`)],
          ['honorific-prefix', new Value(`Prefix or title (e.g. \"Mr.\", \"Ms.\", \"Dr.\", \"Mlle\").`)],
          ['given-name', new Value(`First name.`)],
          ['additional-name', new Value(`Middle name.`)],
          ['family-name', new Value(`Last name.`)],
          ['honorific-suffix', new Value(`Suffix (e.g. \"Jr.\", \"B.Sc.\", \"MBASW\", \"II\").`)],
          ['nickname', new Value(`nickname`)],
          ['email', new Value(`email`)],
          ['username', new Value(`username`)],
          ['new-password', new Value(`A new password (e.g. when creating an account or changing a password).`)],
          ['current-password', new Value(`current-password`)],
          ['organization-title', new Value(`Job title (e.g. \"Software Engineer\", \"Senior Vice President\", \"Deputy Managing Director\").`)],
          ['organization', new Value(`organization`)],
          ['street-address', new Value(`street-address`)],
          ['address-line1', new Value(`address-line1`)],
          ['country', new Value(`country`)],
          ['country-name', new Value(`country-name`)],
          ['postal-code', new Value(`postal-code`)],
          ['cc-name', new Value(`Full name as given on the payment instrument.`)],
          ['cc-given-name', new Value(`cc-given-name`)],
          ['cc-additional-name', new Value(`cc-additional-name`)],
          ['cc-family-name', new Value(`cc-family-name`)],
          ['cc-number', new Value(`Code identifying the payment instrument (e.g. the credit card number).`)],
          ['cc-exp', new Value(`Expiration date of the payment instrument.`)],
          ['cc-exp-month', new Value(`cc-exp-month`)],
          ['cc-exp-year', new Value(`cc-exp-year`)],
          ['cc-csc', new Value(`Security code for the payment instrument.`)],
          ['cc-type', new Value(`Type of payment instrument (e.g. Visa).`)],
          ['transaction-currency', new Value(`transaction-currency`)],
          ['transaction-amount', new Value(`transaction-amount`)],
          ['language', new Value(`Preferred language, valid BCP 47 language tag.`)],
          ['bday', new Value(`bday`)],
          ['bday-day', new Value(`bday-day`)],
          ['bday-month', new Value(`bday-month`)],
          ['bday-year', new Value(`bday-year`)],
          ['sex', new Value(`Gender identity (e.g. Female, Fa'afafine), free-form text, no newlines.`)],
          ['tel', new Value(`tel`)],
          ['url', new Value(`Home page or other Web page corresponding to the company, person, address, or contact information in the other fields associated with this field.`)],
          ['photo', new Value(`Photograph, icon, or other image corresponding to the company, person, address, or contact information in the other fields associated with this field.`)],
        ])));
  }
}
