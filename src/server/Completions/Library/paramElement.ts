import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class ParamElement extends MozDocElement {

  public documentation = `The HTML <param> element defines parameters for an <object> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param';
    this.attributes.set('name',
      new BindableAttribute(`Name of the parameter.`));
    this.attributes.set('value',
      new BindableAttribute(`Specifies the value of the parameter.`));
  }
}
