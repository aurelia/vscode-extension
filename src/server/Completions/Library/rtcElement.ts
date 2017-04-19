import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class RtcElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rtc';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <rtc> element embraces semantic annotations of characters presented in a ruby of <rb> 
  elements used inside of <ruby> element. <rb> elements can have both pronunciation (<rt>) and semantic (<rtc>) annotations.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}
