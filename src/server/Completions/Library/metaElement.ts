import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class MetaElement extends MozDocElement {

  public documentation = `The HTML <meta> element represents any metadata information that cannot be
  represented by one of the other HTML meta-related elements (<base>, <link>, <script>, <style> or <title>).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta';

    this.attributes.set('charset',
      new BindableAttribute(`This attribute declares the character encoding used of the page. It can be locally overridden using the lang attribute on any element. This attribute is a literal string and must be one of the preferred MIME names for a character encoding as defined by the IANA. (https://www.iana.org/assignments/character-sets)`));
    this.attributes.set('content',
      new BindableAttribute(`This attribute gives the value associated with the http-equiv or name attribute, depending on the context.`));
    this.attributes.set('http-equiv',
      new BindableAttribute(`This enumerated attribute defines the pragma that can alter servers and user-agents behavior.`,
        null,
        null,
        null,
        null,
        new Map([
          ['Content-Security-Policy', new Value(`This value allows web site administrators to define content policies for served resources. With a few exceptions, policies mostly involve specifiying server origins and script endpoints. This helps guard against cross-site scripting attacks.`)],
          ['default-style', new Value(`This pragma specifies the preferred stylesheet to be used on the page. The content attribute must contain the title of a <link> element whose href attribute links to a CSS stylesheet, or the title of a <style> element which contains a CSS stylesheet.`)],
          ['refresh', new Value(`This pragma specifies:
the number of seconds until the page should be reloaded, if the content attribute contains only a positive integer number;
the number of seconds until the page should be redirected to another, if the content attribute contains a positive integer number followed by the string ';url=' and a valid URL.`)],
        ])));
    this.attributes.set('name',
      new BindableAttribute(`This attribute defines the name of document-level metadata. It should not be set if one of the attributes itemprop, http-equiv or charset is also set.`,
        null,
        null,
        null,
        null,
        new Map([
          ['application-name', new Value(`defining the name of the web application running in the webpage;`)],
          ['author', new Value(`defining, in a free format, the name of the author of the document;`)],
          ['description', new Value(`containing a short and accurate summary of the content of the page. Several browsers, among them Firefox and Opera, use this meta as the default description of the page when bookmarked;`)],
          ['generator', new Value(`containing, in a free format, the identifier to the software that generated the page;`)],
          ['keywords', new Value(`containing, as strings separated by commas, relevant words associated with the content of the page;`)],
          ['creator', new Value(`defining, in a free format, the name of the creator of the document. Note that it can be the name of the institution. If there are more than one, several <meta> elements should be used;`)],
          ['googlebot', new Value(`which is a synonym of robots, but is only followed by Googlebot, the indexing crawler for Google;`)],
          ['publisher', new Value(`defining, in a free format, the name of the publisher of the document. Note that it can be the name of the institution;`)],
          ['robots', new Value(`defining the behavior that cooperative crawlers should have with the page.`)],
          ['slurp', new Value(`which is a synonym of robots, but is only followed by Slurp, the indexing crawler for Yahoo Search;`)],
          ['viewport', new Value(`which gives hints about the size of the initial size of the viewport. This pragma is used by several mobile devices only.`)]
        ])));
  }
}
