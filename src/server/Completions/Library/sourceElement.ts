import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class SourceElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <source> element specifies multiple media resources for either the <picture>, 
  the <audio> or the <video> element. It is an empty element. It is commonly used to serve the same media content
   in multiple formats supported by different browsers.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('sizes',
      new Attribute(`Is a list of source sizes that describes the final rendered width of the image represented by
       the source. Each source size consists of a comma-separated list of media condition-length pairs. This information
        is used by the browser to determine, before laying the page out, which image defined in srcset to use.`));
    this.attributes.set('src',
      new Attribute(`Required for <audio> and <video>, address of the media resource. The value of this attribute is 
      ignored when the <source> element is placed inside a <picture> element.`));
    this.attributes.set('srcset',
      new Attribute(`A list of one or more strings separated by commas indicating a set of possible images represented
       by the source for the browser to use.`));
    this.attributes.set('type',
      new Attribute(`The MIME-type of the resource, optionally with a codecs parameter. See RFC 4281 for information about how to specify codecs.`));
    this.attributes.set('media',
      new Attribute(`Media query of the resource's intended media; this should be used only in a <picture> element.`));

    this.events = GlobalAttributes.events;
  }
}
