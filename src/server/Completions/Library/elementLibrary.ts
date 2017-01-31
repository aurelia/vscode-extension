import { autoinject } from 'aurelia-dependency-injection';

import InputElement from './inputElement';

@autoinject()
export default class ElementLibrary {
  
  public elements = {};

  constructor(inputElement: InputElement) {
    this.elements[inputElement.name] = inputElement;
  }
}
