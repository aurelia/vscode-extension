import { MozDocElement } from './_elementStructure';

export default class ArticleElement extends MozDocElement {

  public documentation = `The HTML <article> element represents a self-contained composition in a document, page,
  application, or site, which is intended to be independently distributable or reusable (e.g., in syndication).
  Examples include: a forum post, a magazine or newspaper article, or a blog entry.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article';
    this.ariaRoles.push(...['application', 'document', 'feed', 'main', 'presentation', 'region']);
  }
}
