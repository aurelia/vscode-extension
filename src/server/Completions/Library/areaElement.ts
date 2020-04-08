import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class AreaElement extends MozDocElement {

  public documentation = `The HTML <area> element defines a hot-spot region on an image, and optionally associates it with a hypertext link. This element is used only within a <map> element.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area';
    this.areaRolesAllowed = false;
    this.emptyElement = true;
    this.attributes.set('alt',
      new BindableAttribute(
        `A text string alternative to display on browsers that do not display images. The text should be phrased so that it presents the user with the same kind of choice as the image would offer when displayed without the alternative text. In HTML4, this attribute is required, but may be the empty string (""). In HTML5, this attribute is required only if the href attribute is used.`));
    this.attributes.set('coords',
      new BindableAttribute(
        `A set of values specifying the coordinates of the hot-spot region. The number and meaning of the values depend upon the value specified for the shape attribute. For a rect or rectangle shape, the coords value is two x,y pairs: left, top, right, and bottom. For a circle shape, the value is x,y,r where x,y is a pair specifying the center of the circle and r is a value for the radius. For a poly or polygon shape, the value is a set of x,y pairs for each point in the polygon: x1,y1,x2,y2,x3,y3, and so on. In HTML4, the values are numbers of pixels or percentages, if a percent sign (%) is appended; in HTML5, the values are numbers of CSS pixels.`));
    this.attributes.set('download',
      new BindableAttribute(
        `This attribute, if present, indicates that the author intends the hyperlink to be used for downloading a resource. See <a> for a full description of the download attribute.`));
    this.attributes.set('href',
      new BindableAttribute(
        `The hyperlink target for the area. Its value is a valid URL. In HTML4, either this attribute or the nohref attribute must be present in the element. In HTML5, this attribute may be omitted; if so, the area element does not represent a hyperlink.`));
    this.attributes.set('hreflang',
      new BindableAttribute(
        `Indicates the language of the linked resource. Allowed values are determined by BCP47 (https://www.ietf.org/rfc/bcp/bcp47.txt). Use this attribute only if the href attribute is present.`));
    this.attributes.set('media',
      new BindableAttribute(
        `A hint of the media for which the linked resource was designed, for example print and screen. If omitted, it defaults to all. Use this attribute only if the href attribute is present.`));
    this.attributes.set('rel',
      new BindableAttribute(
        `For anchors containing the href attribute, this attribute specifies the relationship of the target object to the link object. The value is a comma-separated list of link types values. The values and their semantics will be registered by some authority that might have meaning to the document author. The default relationship, if no other is given, is void. Use this attribute only if the href attribute is present.`));
    this.attributes.set('shape',
      new BindableAttribute(
        `The shape of the associated hot spot. The specifications for HTML 5 and HTML 4 define the values rect, which defines a rectangular region; circle, which defines a circular region; poly, which defines a polygon; and default, which indicates the entire region beyond any defined shapes. Many browsers, notably Internet Explorer 4 and higher, support circ, polygon, and rectangle as valid values for shape; these values are .`));
    this.attributes.set('target',
      new BindableAttribute(
        `This attribute specifies where to display the linked resource. In HTML4, this is the name of, or a keyword for, a frame. In HTML5, it is a name of, or keyword for, a browsing context (for example, tab, window, or inline frame). Use this attribute only if the href attribute is present.`,
        null,
        null,
        null,
        null,
        new Map([
          ['_self', new Value(`Load the response into the same HTML4 frame (or HTML5 browsing context) as the current one. This value is the default if the attribute is not specified.`)],
          ['_blank', new Value(`Load the response into a new unnamed HTML4 window or HTML5 browsing context.`)],
          ['_parent', new Value(`Load the response into the HTML4 frameset parent of the current frame or HTML5 parent browsing context of the current one. If there is no parent, this option behaves the same way as _self.`)],
          ['_top', new Value(`In HTML4: Load the response into the full, original window, canceling all other frames. In HTML5: Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as _self.`)],
        ])));
  }
}
