import { SimpleAttribute, BaseElement } from './_elementStructure';

export default class AureliaRequireElement extends BaseElement {

  public documentation = `"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`;

  constructor() {
    super();
    this.url = 'http://aurelia.io/hub.html#/doc/article/aurelia/templating/latest/templating-html-behaviors-introduction/4';
    this.hasGlobalAttributes = false;
    this.hasGlobalEvents = false;

    this.attributes.set('from',
      new SimpleAttribute(`The path to the file to require or import`));
    this.attributes.set('as',
      new SimpleAttribute(`The name of custom element once it is imported`));
  }
}
