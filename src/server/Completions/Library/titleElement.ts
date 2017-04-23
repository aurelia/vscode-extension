import { MozDocElement } from './_elementStructure';

export default class TitleElement extends MozDocElement {

  public documentation = `The HTML <title> element defines the title of the document, shown in a browser's title bar or
   on the page's tab. It can only contain text, and any contained tags are ignored.`;
  
  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title';

  }
}
