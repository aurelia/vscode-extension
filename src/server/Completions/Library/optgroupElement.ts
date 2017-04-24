import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class OptGroupElement extends MozDocElement {

  public documentation = ``;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup';

    this.attributes.set('disabled',
      new BindableAttribute(`If this Boolean attribute is set, none of the items in this option group is selectable. Often browsers grey out such control and it won't receive any browsing events, like mouse clicks or focus-related ones.`));
    this.attributes.set('label',
      new BindableAttribute(`The name of the group of options, which the browser can use when labeling the options in the user interface. This attribute is mandatory if this element is used.`));
  }
}
