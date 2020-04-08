import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class HtmlBaseElement extends MozDocElement {

  public documentation = `The HTML <base> element specifies the base URL to use for all relative URLs contained within a document. There can be only one <base> element in a document.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base';
    this.areaRolesAllowed = false;
    this.emptyElement = true;
    this.permittedParents.push("head");

    this.attributes.set('href',
      new BindableAttribute(`The base URL to be used throughout the document for relative URL addresses. If this attribute is specified, this element must come before any other elements with attributes whose values are URLs. Absolute and relative URLs are allowed.`));
    this.attributes.set('target',
      new BindableAttribute(`A name or keyword indicating the default location to display the result when hyperlinks or forms cause navigation, for elements that do not have an explicit target reference. It is a name of, or keyword for, a browsing context (for example: tab, window, or inline frame).`,
        null,
        null,
        null,
        null,
        new Map([
          ['_self', new Value(`Load the result into the same browsing context as the current one. This value is the default if the attribute is not specified.`)],
          ['_blank', new Value(`Load the result into a new unnamed browsing context.`)],
          ['_parent', new Value(`Load the result into the parent browsing context of the current one. If there is no parent, this option behaves the same way as _self.`)],
          ['_top', new Value(`Load the result into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as _self.`)],
        ])));
  }
}
