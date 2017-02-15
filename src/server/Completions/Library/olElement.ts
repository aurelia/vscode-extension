import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class OlElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('reversed',
      new Attribute(`This Boolean attribute specifies that the items of the list are specified in reversed order.`));
    this.attributes.set('start',
      new Attribute(`This integer attribute specifies the start value for numbering the individual list items. Although the ordering type of list elements might be Roman numerals, such as XXXI, or letters, the value of start is always represented as a number. To start numbering elements from the letter "C", use <ol start="3">.`));
    this.attributes.set('type',
      new Attribute(`Indicates the numbering type`,
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

    this.events = GlobalAttributes.events;
  }
}
