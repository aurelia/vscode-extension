import { BaseElement } from './_elementStructure';

export default class NoScriptElement extends BaseElement {

  public documentation = `The HTML <noscript> element defines a section of html to be inserted if a script type 
  on the page is unsupported or if scripting is currently turned off in the browser.`;
  
  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript';
  }
}
