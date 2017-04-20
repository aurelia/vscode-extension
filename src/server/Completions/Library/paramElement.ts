import { Attribute, BaseElement } from './_elementStructure';

export default class ParamElement extends BaseElement {

  public documentation = `The HTML <param> element defines parameters for an <object> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param';
    this.attributes.set('name',
      new Attribute(`Name of the parameter.`));
    this.attributes.set('value',
      new Attribute(`Specifies the value of the parameter.`));
  }
}
