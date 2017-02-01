import AElement from './aElement';
import InputElement from './inputElement';

export default class ElementLibrary {
  
  public elements = {};

  constructor() {

    let aElement = new AElement();
    let inputElement = new InputElement();

    this.elements[aElement.name] = aElement;
    this.elements[inputElement.name] = inputElement;
  }
}
