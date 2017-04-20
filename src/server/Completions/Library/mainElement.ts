import { BaseElement } from './_elementStructure';

export default class MainElement extends BaseElement {

  public documentation = `The HTML <main> element represents the main content of  the <body> of a 
  document or application. The main content area consists of content that is directly related to, 
  or expands upon the central topic of a document or the central functionality of an application.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main';
  }
}
