import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class ObjectElement extends MozDocElement {

  public documentation = `The HTML <object> element represents an external resource, which can be treated as an image,
  a nested browsing context, or a resource to be handled by a plugin`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object';

    this.attributes.set('data',
      new BindableAttribute(`The address of the resource as a valid URL. At least one of data and type must be defined.`));
    this.attributes.set('form',
      new BindableAttribute(`The form element, if any, that the object element is associated with (its form owner). The value of the attribute must be an ID of a <form> element in the same document.`));
    this.attributes.set('height',
      new BindableAttribute(`The height of the displayed resource, in CSS pixels.`));
    this.attributes.set('name',
      new BindableAttribute(`The name of valid browsing context (HTML5)`));
    this.attributes.set('type',
      new BindableAttribute(`The content type of the resource specified by data. At least one of data and type must be defined.`));
    this.attributes.set('typemustmatch',
      new BindableAttribute(`This Boolean attribute indicates if the type and the actual content type resource must match in order of this one to be used.`));
    this.attributes.set('usemap',
      new BindableAttribute(`A hash-name reference to a <map> element; that is a '#' followed by the value of a name of a map element.`));
    this.attributes.set('width',
      new BindableAttribute(`The width of the display resource, in CSS pixels.`));

  }
}
