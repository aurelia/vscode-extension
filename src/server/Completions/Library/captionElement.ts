import { BaseElement } from './_elementStructure';

export default class CaptionElement extends BaseElement {

  public documentation = `The HTML <caption> element represents the title of a table. Though it is always the first 
  descendant of a <table>, its styling, using CSS, may place it elsewhere, relative to the table.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption';
  }
}
