import { MozDocElement } from './_elementStructure';

export default class RubyElement extends MozDocElement {

  public documentation = `The HTML <ruby> element represents a ruby annotation. Ruby annotations are for
  showing pronunciation of East Asian characters.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby';
  }
}
