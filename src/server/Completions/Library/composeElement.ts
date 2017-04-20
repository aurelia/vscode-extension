import { Attribute, BaseElement } from './_elementStructure';

export default class ComposeElement extends BaseElement {

  public documentation = `In order to live by the DRY (Don't Repeat Yourself) Principle, we don't necessarily want to 
  rely on tight coupling between our view and view-model pairs. Wouldn't it be great if there was a custom element
  that would arbitrarily combine an HTML template, a view-model, and maybe even some initialization data for us?`;

  constructor() {
    super();
    this.url = 'http://aurelia.io/hub.html#/doc/article/aurelia/templating/latest/templating-basics/4';
    this.licenceText = '';

    this.attributes.set('model',
      new Attribute(`The model to bind the compose to`));
    this.attributes.set('view-model',
      new Attribute(`The view model to bind the compose to`));
    this.attributes.set('view',
      new Attribute(`The location of the view file to compose`));        
  }
}
