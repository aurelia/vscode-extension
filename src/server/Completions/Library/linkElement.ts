import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class LinkElement extends MozDocElement {

  public documentation = `The HTML <link> element specifies relationships between the current document and an external
  resource. Possible uses for this element include defining a relational framework for navigation. This Element is
   most used to link to style sheets.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link';
    this.attributes.set('crossorigin',
      new BindableAttribute(`This enumerated attribute indicates if the fetching of the related image must be done using CORS or not. CORS-enabled images can be reused in the <canvas> element without being "tainted.`,
        null,
        null,
        null,
        null,
        new Map([
          ['anonymous', new Value(`A cross-origin request (i.e., with Origin: HTTP header) is performed. But no credential is sent (i.e., no cookie, no X.509 certificate, and no HTTP Basic authentication is sent). If the server does not give credentials to the origin site (by not setting the Access-Control-Allow-Origin: HTTP header), the image will be tainted and its usage restricted.`)],
          ['use-credentials', new Value(`A cross-origin request (i.e., with Origin: HTTP header) performed with credential is sent (i.e., a cookie, a certificate, and HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through Access-Control-Allow-Credentials: HTTP header), the image will be tainted and its usage restricted.`)],
        ])));
    this.attributes.set('href',
      new BindableAttribute(`This attribute specifies the URL of the linked resource. A URL might be absolute or relative.`));
    this.attributes.set('hreflang',
      new BindableAttribute(`This attribute indicates the language of the linked resource. It is purely advisory. Allowed values are determined by BCP47. Use this attribute only if the href attribute is present.`));
    this.attributes.set('media',
      new BindableAttribute(`This attribute specifies the media which the linked resource applies to. Its value must be a media query. This attribute is mainly useful when linking to external stylesheets by allowing the user agent to pick the best adapted one for the device it runs on.`));
    this.attributes.set('rel',
      new BindableAttribute(`This attribute names a relationship of the linked document to the current document. The attribute must be a space-separated list of the link types values. The most common use of this attribute is to specify a link to an external style sheet: the rel attribute is set to stylesheet, and the href attribute is set to the URL of an external style sheet to format the page. WebTV also supports the use of the value next for rel to preload the next page in a document series.`));
    this.attributes.set('sizes',
      new BindableAttribute(`This attribute defines the sizes of the icons for visual media contained in the resource. It must be present only if the rel contains the icon link types value.`));
    this.attributes.set('title',
      new BindableAttribute(`The title attribute has special semantics on the <link> element. When used on a <link rel="stylesheet"> it defines a preferred or an alternate stylesheet (https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets). Incorrectly using it may cause the stylesheet to be ignored (https://developer.mozilla.org/en-US/docs/Correctly_Using_Titles_With_External_Stylesheets).`));
    this.attributes.set('type',
      new BindableAttribute(`This attribute is used to define the type of the content linked to. The value of the attribute should be a MIME type such as text/html, text/css, and so on. The common use of this attribute is to define the type of style sheet linked and the most common current value is text/css, which indicates a Cascading Style Sheet format.`));
  }
}
