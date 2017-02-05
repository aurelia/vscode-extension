import { singleton } from 'aurelia-dependency-injection';

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
import BdiElement from './bdiElement';
import BdoElement from './bdoElement';
import BlockquoteElement from './blockquoteElement';
import BodyElement from './bodyElement';
import BrElement from './brElement';
import ButtonElement from './buttonElement';
import CanvasElement from './canvasElement';
import CaptionElement from './captionElement';
import CiteElement from './citeElement';
import CodeElement from './codeElement';
import ColElement from './colElement';
import ColgroupElement from './colgroupElement';
import DataElement from './dataElement';
import DatalistElement from './datalistElement';
import DdElement from './ddElement';
import DelElement from './delElement';
import DetailsElement from './detailsElement';
import DfnElement from './dfnElement';
import DivElement from './divElement';
import DlElement from './dlElement';
import DtElement from './dtElement';
import EmElement from './emElement';
import EmbedElement from './embedElement';
import FieldsetElement from './fieldsetElement';
import FigcaptonElement from './figcaptionElement';
import FigureElement from './figureElement';
import FooterElement from './footerElement';
import FormElement from './formElement';
import HElement from './hElement';
import HeadElement from './headElement';
import HeaderElement from './headerElement';
import HrElement from './hrElement';
import HtmlElement from './htmlElement';
import IElement from './iElement';
import IframeElement from './iframeElement';
import ImgElement from './imgElement';
import InsElement from './insElement';

@singleton()
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
    this.elements['bdi'] = new BdiElement();
    this.elements['bdo'] = new BdoElement();
    this.elements['blockquote'] = new BlockquoteElement();
    this.elements['bodyElement'] = new BodyElement();
    this.elements['br'] = new BrElement();
    this.elements['button'] = new ButtonElement();
    this.elements['canvas'] = new CanvasElement();
    this.elements['caption'] = new CaptionElement();
    this.elements['cite'] = new CiteElement();
    this.elements['code'] = new CodeElement();
    this.elements['col'] = new ColElement();
    this.elements['colgroup'] = new ColgroupElement();
    this.elements['data'] = new DataElement();
    this.elements['datalist'] = new DatalistElement();
    this.elements['dd'] = new DdElement();
    this.elements['del'] = new DelElement();
    this.elements['details'] = new DetailsElement();
    this.elements['dfn'] = new DfnElement();
    this.elements['div'] = new DivElement();
    this.elements['dl'] = new DlElement();
    this.elements['dt'] = new DtElement();
    this.elements['em'] = new EmElement();
    this.elements['embed'] = new EmbedElement();
    this.elements['fieldset'] = new FieldsetElement();
    this.elements['figcaption'] = new FigcaptonElement();
    this.elements['figure'] = new FigureElement();
    this.elements['footer'] = new FooterElement();
    this.elements['form'] = new FormElement();
    let header = new HElement();
    this.elements['h1'] = header;
    this.elements['h2'] = header;
    this.elements['h3'] = header;
    this.elements['h4'] = header;
    this.elements['h5'] = header;
    this.elements['h6'] = header;
    this.elements['head'] = new HeadElement();
    this.elements['header'] = new HeaderElement();
    this.elements['hr'] = new HrElement();
    this.elements['html'] = new HtmlElement();
    this.elements['i'] = new IElement();
    this.elements['iframe'] = new IframeElement();
    this.elements['img'] = new ImgElement();
    this.elements['input'] = new InputElement();
    this.elements['ins'] = new InsElement();




    this.elements['compose'] = new ComposeElement();

  }
}

