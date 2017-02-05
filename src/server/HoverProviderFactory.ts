import { Hover } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Completions/Library/_elementLibrary';


@autoinject()
export default class HoverProviderFactory {

  constructor(private elementLibrary: ElementLibrary) { }

  public create(text: string, offset: number): Hover {

  let leadingCharacter = '', appixCharacter = '';
  
  let backPos = offset;
  while(true) {
    let char = text[backPos];
    if (char === ' ' || char === '/' || char === '<' || char === undefined) {
      leadingCharacter = char;
      backPos = backPos + 1;
      break;
    }
    backPos = backPos - 1;
  }

  let nextPos = offset;
  while(true) {
    let char = text[nextPos];
    if (char === ' ' || char === '/' || char === '>' || char === '=' || char === undefined) {
      appixCharacter = char;
      break;
    }
    nextPos = nextPos + 1;
  }

  let tag = text.substring(backPos, nextPos);
  let displayValue = '';
  let documentation = '';
  let source = '';
  let moreInfo = '';
  let element;
  switch(leadingCharacter) {
    case '<':
      element = this.elementLibrary.elements[tag];
      documentation = element.documentation;
      source = element.licenceText;
      moreInfo = `more information: ${element.url}`;
      displayValue = `<${tag}>`;
    break;
    case '/':
      element = this.elementLibrary.elements[tag];
      documentation = element.documentation;
      source =  element.licenceText;
      moreInfo = `more information: ${element.url}`;    
      displayValue = `</${tag}>`;
    break;
    case ' ':
      let elementName = /<(\w*)\b.*$/g.exec(text.substring(0, offset))[1];
      displayValue = `<${elementName} ${tag}="">`;
      
      // fixes
      if (tag.startsWith('data-')) {
        tag = 'data-*';
      }
      if (tag.indexOf('.')) {
        tag = tag.split('.')[0];
      }
      
      let attribute = this.elementLibrary.elements[elementName].attributes.get(tag);
      let event = this.elementLibrary.elements[elementName].events.get(tag);
      if (attribute) {
        documentation = attribute.documentation;
        moreInfo = attribute.url || this.elementLibrary.elements[elementName].url;
        source = this.elementLibrary.elements[elementName].licenceText
      }
      if (event) {
        documentation = event.documentation;
        moreInfo = event.url;
        source =  `MDN by Mozilla Contributors (${event.url}$history) is licensed under CC-BY-SA 2.5.`;
      }      
  }


	return {
    contents: [ 
      { language: 'aurelia-html', value: displayValue }, 
      { language: 'markdown', value: documentation }, 
      moreInfo,
      source
    ]
  }

  }
}
