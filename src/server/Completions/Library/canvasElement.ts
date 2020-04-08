import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class CanvasElement extends MozDocElement {

  public documentation = `Use the HTML <canvas> element with the canvas
  scripting API (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to draw graphics and animations.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas';

    this.attributes.set('height',
      new BindableAttribute(`The height of the coordinate space in CSS pixels. Defaults to 150.`));
    this.attributes.set('width',
      new BindableAttribute(`The width of the coordinate space in CSS pixels. Defaults to 300.`));
  }
}
