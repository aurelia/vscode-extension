import { Hover } from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Completions/Library/_elementLibrary';
import { MozDocElement } from './Completions/Library/_elementStructure';

@autoinject()
export default class HoverProviderFactory {

  public constructor(private readonly elementLibrary: ElementLibrary) { }

  public create(text: string, offset: number): Hover {

    let leadingCharacter = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let appixCharacter = '';

    let backPos = offset;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const char = text[backPos];
      if (char === ' ' || char === '/' || char === '<' || char === undefined) {
        leadingCharacter = char;
        backPos = backPos + 1;
        break;
      }
      backPos = backPos - 1;
    }

    let nextPos = offset;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const char = text[nextPos];
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
    switch (leadingCharacter) {
      case '<':
        element = this.elementLibrary.elements[tag] || this.elementLibrary.unknownElement;
        if (element) {
          documentation = element.documentation;
          moreInfo = `more information: ${element.url}`;
          displayValue = `<${tag}>`;
        }
        break;
      case '/':
        element = this.elementLibrary.elements[tag];
        if (element) {
          documentation = element.documentation;
          moreInfo = `more information: ${element.url}`;
          displayValue = `</${tag}>`;
        }
        break;
      case ' ': {
        const matches = /<(\w*)\b.*$/g.exec(text.substring(0, offset));
        if (!matches || matches.length === 0) {
          return;
        }
        const elementName = matches[1];
        displayValue = `<${elementName} ${tag}="">`;

        // fixes
        if (tag.startsWith('data-')) {
          tag = 'data-*';
        }
        if (tag.indexOf('.') > 0) {
          tag = tag.split('.')[0];
        }

        element = this.elementLibrary.elements[elementName] || this.elementLibrary.unknownElement;
        const attribute = element.attributes.get(tag);
        const event = element.events.get(tag);
        if (attribute) {
          documentation = attribute.documentation;
          moreInfo = attribute.url || element.url;
        }
        if (event) {
          documentation = event.documentation;
          moreInfo = event.url;
          source = `MDN by Mozilla Contributors (${event.url}$history) is licensed under CC-BY-SA 2.5.`;
        }
      }
    }

    documentation = documentation.replace(/\s\s+/g, ' ');

    if (documentation === '') {
      return undefined;
    }

    if (element instanceof MozDocElement) {
      source = element.licenceText;
    }

    return {
      contents: [
        { language: 'html', value: displayValue },
        { language: 'markdown', value: documentation },
        moreInfo,
        source
      ]
    };

  }
}
