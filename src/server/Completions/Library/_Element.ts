import { BindableAttribute, BaseElement } from './_elementStructure';

export default class _Element extends BaseElement {

  public documentation = ``;

  constructor() {
    super();
    this.url = '';
    this.attributes.set('',
      new BindableAttribute(``));
  }
}
