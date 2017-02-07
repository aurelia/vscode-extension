import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class MetaElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <meta> element represents any metadata information that cannot be represented by one of the other HTML meta-related elements (<base>, <link>, <script>, <style> or <title>).`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('charset',
      new Attribute(`This attribute declares the character encoding used of the page. It can be locally overridden using the lang attribute on any element. This attribute is a literal string and must be one of the preferred MIME names for a character encoding as defined by the IANA. (https://www.iana.org/assignments/character-sets)`));
    this.attributes.set('content',
      new Attribute(`This attribute gives the value associated with the http-equiv or name attribute, depending on the context.`));
    this.attributes.set('http-equiv',
      new Attribute(`This enumerated attribute defines the pragma that can alter servers and user-agents behavior.`,
      null,
      null,
      null,
      null,
      new Map([
          ['', new Value(``)],
          ['', new Value(``)],
      ])));
    this.attributes.set('',
      new Attribute(``));
    this.attributes.set('',
      new Attribute(``));
    this.attributes.set('',
      new Attribute(``));
    this.attributes.set('',
      new Attribute(``));
    this.attributes.set('',
      new Attribute(``));                              

    this.events = GlobalAttributes.events;
  }
}
