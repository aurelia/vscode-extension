import { Attribute, BaseElement } from './_elementStructure';

export default class CanvasElement extends BaseElement {

  public documentation = `Use the HTML <canvas> element with the canvas 
  scripting API (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to draw graphics and animations.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas';

    this.attributes.set('height',
      new Attribute(`The height of the coordinate space in CSS pixels. Defaults to 150.`));
    this.attributes.set('width',
      new Attribute(`The width of the coordinate space in CSS pixels. Defaults to 300.`));
  }
}
