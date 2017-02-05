import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem, Position } from 'vscode-languageserver-types';
import AttributeCompletionFactory from './Completions/AttributeCompletionFactory';
import ElementCompletionFactory from './Completions/ElementCompletionFactory';
import AttributeValueCompletionFactory from './Completions/AttributeValueCompletionFactory';
import BindingCompletionFactory from './Completions/BindingCompletionFactory';
import { DocumentParser, TagDefinition } from './DocumentParser';

@autoinject()
export default class CompletionItemFactory {

  constructor(
    private attributeCompletionFactory: AttributeCompletionFactory,
    private elementCompletionFactory: ElementCompletionFactory,
    private attributeValueCompletionFactory: AttributeValueCompletionFactory,
    private bindingCompletionFactory: BindingCompletionFactory,
    private parser: DocumentParser) { }

  public async create(
    triggerCharacter: string,
    position: Position,    
    text: string,
    positionNumber: number,
    uri: string): Promise<Array<CompletionItem>> {

      let nodes = await this.parser.parse(text);     
      let insideTag: TagDefinition = null;
      let beforeTag: TagDefinition = null;
      let afterTag: TagDefinition = null;

      for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        // check if inside element
        if (!insideTag && positionNumber >= node.startOffset && positionNumber <= node.endOffset) {
          insideTag = node;
        }
        if (!insideTag && node.startOffset < positionNumber) {
            beforeTag = node;
        }
        if (!afterTag && node !== insideTag && node.endOffset > positionNumber) {
          afterTag = node;
          break;
        }
      }

      // auto complete inside a tag
      if (insideTag) {

        switch (triggerCharacter) {
          case ' ':
               return this.attributeCompletionFactory.create(insideTag.name, insideTag.attributes.map(i => i.name));
          case '.':
            return this.createBindingCompletion(insideTag, text, positionNumber);
          case '"':
          case '\'':
               return this.createValueCompletion(insideTag, text, positionNumber);
          default:
            return [];
        }
      }

      // auto complete others
      switch (triggerCharacter) {
        case '<':
          return this.elementCompletionFactory.create((beforeTag && beforeTag.startTag) ? beforeTag.name : null);
        case '[':
          return this.createEmmetCompletion(text, positionNumber);
        default:
          return [];
      }
  }

  private createValueCompletion(tag: TagDefinition, text: string, position: number) {
    let nextCharacter = text.substring(position, position + 1);
    if (/['"]/.test(nextCharacter)) {
      let attribute;
      let elementText = text.substring(tag.startOffset, tag.endOffset);
      let tagPosition = position - tag.startOffset;
      const attributeRegex = /([\w-]+)\.?\w*\=['"]/g;
      let matches;
      while (matches = attributeRegex.exec(elementText)) {
        if (tagPosition >= matches.index && (tagPosition <= matches.index + matches[0].length)) {
          let foundText = matches[1];
          let attributes = tag.attributes.filter(a => a.name == foundText);
          if (attributes.length) {
            attribute = attributes[0];
            break;
          }
        }  
      }
      return this.attributeValueCompletionFactory.create(tag.name, attribute.name, attribute.binding);
    }
  }

  private createEmmetCompletion(text: string, position: number) {
    return null;
  }

  private createBindingCompletion(tag: TagDefinition, text: string, position: number) {
    let attribute;
    let elementText = text.substring(tag.startOffset, tag.endOffset);
    let tagPosition = position - tag.startOffset;
    const attributeRegex = /([\w\.-]+)(\=['"](.*?)["'])?/g;
    let matches;
    while (matches = attributeRegex.exec(elementText)) {
      if (tagPosition >= matches.index && (tagPosition <= matches.index + matches[1].length)) {
        let foundText = matches[1];
        let attributes = tag.attributes.filter(a => a.name + (a.binding !== undefined ? '.' : '') == foundText);
        if (attributes.length) {
          attribute = attributes[0];
          break;
        }
      }  
    }
    return this.bindingCompletionFactory.create(tag, attribute, text.substring(position, position + 1));
  }
}
