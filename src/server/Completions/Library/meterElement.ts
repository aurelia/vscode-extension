import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class MeterElement extends MozDocElement {

  public documentation = `The HTML <meter> element represents either a scalar value within a known range or
   a fractional value.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter';

    this.attributes.set('value',
      new BindableAttribute(`The current numeric value. This must be between the minimum and maximum values (min attribute and max attribute) if they are specified. If unspecified or malformed, the value is 0. If specified, but not within the range given by the min attribute and max attribute, the value is equal to the nearest end of the range.`));
    this.attributes.set('min',
      new BindableAttribute(`The lower numeric bound of the measured range. This must be less than the maximum value (max attribute), if specified. If unspecified, the minimum value is 0.`));
    this.attributes.set('max',
      new BindableAttribute(`The upper numeric bound of the measured range. This must be greater than the minimum value (min attribute), if specified. If unspecified, the maximum value is 1.`));
    this.attributes.set('low',
      new BindableAttribute(`The upper numeric bound of the low end of the measured range. This must be greater than the minimum value (min attribute), and it also must be less than the high value and maximum value (high attribute and max attribute, respectively), if any are specified. If unspecified, or if less than the minimum value, the low value is equal to the minimum value.`));
    this.attributes.set('high',
      new BindableAttribute(`The lower numeric bound of the high end of the measured range. This must be less than the maximum value (max attribute), and it also must be greater than the low value and minimum value (low attribute and min attribute, respectively), if any are specified. If unspecified, or if greater than the maximum value, the high value is equal to the maximum value.`));
    this.attributes.set('optimum',
      new BindableAttribute(`This attribute indicates the optimal numeric value. It must be within the range (as defined by the min attribute and max attribute). When used with the low attribute and high attribute, it gives an indication where along the range is considered preferable. For example, if it is between the min attribute and the low attribute, then the lower range is considered preferred.`));
    this.attributes.set('form',
      new BindableAttribute(`This attribute associates the element with a form element that has ownership of the meter element. For example, a meter might be displaying a range corresponding to an input element of type number. This attribute is only used if the meter element is being used as a form-associated element; even then, it may be omitted if the element appears as a descendant of a form element.`));                               
  }
}
