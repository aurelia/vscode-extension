import AElement from './aElement';
import AbbrElement from './abbrElement';
import InputElement from './inputElement';
import ComposeElement from './composeElement';
import AddressElement from './addressElement';
import AreaElement from './areaElement';
import ArticleElement from './articleElement';
import AsideElement from './asideElement';
import AudioElement from './audioElement';
import BElement from './bElement';
import BaseElement from './baseElement';

export default class ElementLibrary {
  
  public elements = {};

  constructor() {

    this.elements['a'] = new AElement();
    this.elements['abbr'] = new AbbrElement();
    this.elements['address'] = new AddressElement();
    this.elements['area'] = new AreaElement();
    this.elements['article'] = new ArticleElement();
    this.elements['aside'] = new AsideElement();
    this.elements['audio'] = new AudioElement();
    this.elements['b'] = new BElement();
    this.elements['base'] = new BaseElement();


    this.elements['input'] = new InputElement();
    this.elements['compose'] = new ComposeElement();
  }
}

