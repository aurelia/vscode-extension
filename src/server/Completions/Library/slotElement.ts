import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class SlotElement extends MozDocElement {

  public documentation = `The HTML <slot> element is a placeholder inside a web component that you can fill
  with your own markup, with the effect of composing different DOM trees together. A named slot is a <slot> element with a name attribute.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot';
    this.attributes.set('name',
      new BindableAttribute(`The slot's name.`));
  }
}
