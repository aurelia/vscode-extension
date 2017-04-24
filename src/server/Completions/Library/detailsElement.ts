import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class DetailsElement extends MozDocElement {

  public documentation = `The HTML <details> element is used as a disclosure widget from which the user can retrieve 
  additional information.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details';
    this.areaRolesAllowed = false;
    this.attributes.set('open',
      new BindableAttribute(`This Boolean attribute indicates whether the details will be shown to the user on page load. Default is false and so details will be hidden.`));
  }
}
