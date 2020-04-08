import { MozDocElement } from './_elementStructure';

export default class IElement extends MozDocElement {

  public documentation = `The HTML <i> element represents a range of text that is set off from the normal text
  for some reason, for example, technical terms, foreign language phrases, or fictional character thoughts.
  It is typically displayed in italic type.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i';
  }
}
