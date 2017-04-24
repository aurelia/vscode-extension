import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class OlElement extends MozDocElement {

  public documentation = `The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol';

    this.attributes.set('reversed',
      new BindableAttribute(`This Boolean attribute specifies that the items of the list are specified in reversed order.`));
    this.attributes.set('start',
      new BindableAttribute(`This integer attribute specifies the start value for numbering the individual list items. Although the ordering type of list elements might be Roman numerals, such as XXXI, or letters, the value of start is always represented as a number. To start numbering elements from the letter "C", use <ol start="3">.`));
    this.attributes.set('type',
      new BindableAttribute(`Indicates the numbering type`,
      null,
      null,
      null,
      null,
      new Map([
          ['a', new Value(`indicates lowercase letters`)],
          ['A', new Value(`indicates uppercase letters`)],
          ['i', new Value(`indicates lowercase Roman numerals`)],
          ['I', new Value(`indicates uppercase Roman numerals`)],
          ['1', new Value(`indicates numbers (default)`)],
      ])));                 
  }
}
