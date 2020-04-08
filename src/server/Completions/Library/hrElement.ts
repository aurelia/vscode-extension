import { MozDocElement } from './_elementStructure';

export default class HrElement extends MozDocElement {

  public documentation = `The HTML <hr> element represents a thematic break between paragraph-level
  elements (for example, a change of scene in a story, or a shift of topic with a section). In previous
  versions of HTML, it represented a horizontal rule. It may still be displayed as a horizontal rule
  in visual browsers, but is now defined in semantic terms, rather than presentational terms.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr';
  }
}
