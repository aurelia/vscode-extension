import { BaseElement } from './_elementStructure';

export default class NoFramesElement extends BaseElement {

  public documentation = `<noframes> is an HTML element which is used to supporting browsers which are not able 
  to support <frame> elements or configured to do so.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noframes';

  }
}
