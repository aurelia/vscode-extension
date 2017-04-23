import { MozDocElement } from './_elementStructure';

export default class TBodyElement extends MozDocElement {

  public documentation = `The HTML <tbody> element groups one or more <tr> elements as the body of a <table> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody';
  }
}
