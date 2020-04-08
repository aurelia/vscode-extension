import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class LiElement extends MozDocElement {

  public documentation = `The HTML <li> element is used to represent an item in a list. It must be contained in
  a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered
  lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with
  an ascending counter on the left, such as a number or letter.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li';
    this.permittedParents.push(...['ul', 'ol']);

    this.attributes.set('value',
      new BindableAttribute(`This integer attribute indicates the current ordinal value of the list item as
      defined by the <ol> element. The only allowed value for this attribute is a number, even if the
      list is displayed with Roman numerals or letters. List items that follow this one continue numbering
      from the value set. The value attribute has no meaning for unordered lists (<ul>) or for menus (<menu>).`));
  }
}
