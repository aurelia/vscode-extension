import { Attribute, BaseElement } from './_elementStructure';

export default class DetailsElement extends BaseElement {

  public documentation = `The HTML <details> element is used as a disclosure widget from which the user can retrieve 
  additional information.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details';
    this.attributes.set('open',
      new Attribute(`This Boolean attribute indicates whether the details will be shown to the user on page load. Default is false and so details will be hidden.`));
  }
}
