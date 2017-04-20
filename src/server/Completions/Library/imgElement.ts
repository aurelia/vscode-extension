import { Attribute, Value, BaseElement } from './_elementStructure';

export default class ImgElement extends BaseElement {

  public documentation = `The HTML <img> element represents an image in the document.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img';

    this.attributes.set('alt',
      new Attribute(`This attribute defines the alternative text describing the image. Users will see this text displayed if the image URL is wrong, the image is not in one of the supported formats, or if the image is not yet downloaded.`));
    this.attributes.set('crossorigin',
      new Attribute(`This enumerated attribute indicates if the fetching of the related image must be done using CORS or not. CORS-enabled images can be reused in the <canvas> element without being "tainted.`,
      null,
      null,
      null,
      null,
      new Map([
          ['anonymous', new Value(`A cross-origin request (i.e., with Origin: HTTP header) is performed. But no credential is sent (i.e., no cookie, no X.509 certificate, and no HTTP Basic authentication is sent). If the server does not give credentials to the origin site (by not setting the Access-Control-Allow-Origin: HTTP header), the image will be tainted and its usage restricted.`)],
          ['use-credentials', new Value(`A cross-origin request (i.e., with Origin: HTTP header) performed with credential is sent (i.e., a cookie, a certificate, and HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through Access-Control-Allow-Credentials: HTTP header), the image will be tainted and its usage restricted.`)],
      ])));
    this.attributes.set('height',
      new Attribute(`The intrinsic height of the image in pixels. In HTML 4, the height could be defined pixels or as a percentage. In HTML5, however, the value must be in pixels.`));
    this.attributes.set('ismap',
      new Attribute(`This Boolean attribute indicates that the image is part of a server-side map. If so, the precise coordinates of a click are sent to the server.`));
    this.attributes.set('longdesc',
      new Attribute(`A link to a more detailed description of the image. Possible values are a URL or an element id.`));
    this.attributes.set('sizes',
      new Attribute(`A list of one or more strings separated by commas indicating a set of source sizes.`));
    this.attributes.set('src',
      new Attribute(`The image URL. This attribute is mandatory for the <img> element. On browsers supporting srcset, src is treated like a candidate image with a pixel density descriptor 1x unless an image with this pixel density descriptor is already defined in srcset, or unless srcset contains 'w' descriptors.`));
    this.attributes.set('srcset',
      new Attribute(`A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use.`));
    this.attributes.set('width',
      new Attribute(`The intrinsic width of the image in pixels. In HTML 4, either a percentage or pixels were acceptable values. In HTML5, however, only pixels are acceptable.`));                                          
    this.attributes.set('usemap',
      new Attribute(`The partial URL (starting with '#') of an image map associated with the element.`)); 
  }
}
