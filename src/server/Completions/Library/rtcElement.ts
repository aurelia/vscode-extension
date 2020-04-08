import { MozDocElement } from './_elementStructure';

export default class RtcElement extends MozDocElement {

  public documentation = `The HTML <rtc> element embraces semantic annotations of characters presented in a ruby of <rb>
  elements used inside of <ruby> element. <rb> elements can have both pronunciation (<rt>) and semantic (<rtc>) annotations.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rtc';
  }
}
