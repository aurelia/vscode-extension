import AElement from './aElement';
import AbbrElement from './abbrElement';
import InputElement from './inputElement';
import ComposeElement from './composeElement';

export default class ElementLibrary {
  
  public elements = {};

  constructor() {

    let aElement = new AElement();
    let abbrElement = new AbbrElement();
    let inputElement = new InputElement();
    let composeElement = new ComposeElement();

    this.elements[aElement.name] = aElement;
    this.elements[abbrElement.name] = abbrElement;
    this.elements[inputElement.name] = inputElement;


    this.elements[composeElement.name] = composeElement;
  }
}
