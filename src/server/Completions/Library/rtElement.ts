import { MozDocElement } from './_elementStructure';

export default class RtElement extends MozDocElement {

  public documentation = `The HTML <rt> element embraces pronunciation of characters presented in a ruby annotations,
  which are used to describe the pronunciation of East Asian characters. This element is always used inside a <ruby> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt';
  }
}
