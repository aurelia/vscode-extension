import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class CanvasElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `Use the HTML <canvas> element with the canvas scripting API (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to draw graphics and animations.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('height',
      new Attribute(`The height of the coordinate space in CSS pixels. Defaults to 150.`));
    this.attributes.set('width',
      new Attribute(`The width of the coordinate space in CSS pixels. Defaults to 300.`));

    this.events = GlobalAttributes.events;
  }
}
