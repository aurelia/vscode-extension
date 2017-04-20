import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TimeElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <time> element represents either a time on a 24-hour clock or a precise date in 
  the Gregorian calendar (with optional time and timezone information).`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('datetime',
      new Attribute(`This attribute indicates the time and date of the element and must be a valid date with an optional 
      time string. If the value cannot be parsed as a date with an optional time string, the element does not have an 
      associated time stamp.`));

    this.events = GlobalAttributes.events;
  }
}
