import { Attribute, BaseElement } from './_elementStructure';

export default class MapElement extends BaseElement {

  public documentation = `The HTML <map> element is used with <area> elements to define an image map (a clickable link area).`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map';
    this.attributes.set('name',
      new Attribute(`The name attribute gives the map a name so that it can be referenced. The attribute must be present and must have a non-empty value with no space characters. The value of the name attribute must not be a compatibility-caseless match for the value of the name attribute of another map element in the same document. If the id attribute is also specified, both attributes must have the same value.`));
  }
}
