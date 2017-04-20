import { BaseElement } from './_elementStructure';

export default class UnknownElement extends BaseElement {

  public documentation = ``;

  constructor() {
    super();
    this.url = '';
    this.licenceText = '';
  }
}
