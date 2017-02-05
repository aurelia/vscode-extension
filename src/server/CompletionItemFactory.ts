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
               return this.createValueCompletion(text, positionNumber);
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

  private elementMatch = /<([a-zA-Z-]*)\s([^<]*)$/;
  private attributeMatch = /([a-zA-Z-]*)\.?([a-zA-Z-]*)?=['"]$/;
  private attributeSplitterMatch = /(\S[^\. ]+)(\.(\S+))?=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;


  private createValueCompletion(text: string, position: number) {
    let nextCharacter = text.substring(position, position + 1);
    if (/['"]/.test(nextCharacter)) {
      let postText = text.substring(0, position);
      let elementMatch = this.elementMatch.exec(postText);
      let attributeMatch = this.attributeMatch.exec(postText);
      if (elementMatch !== null && elementMatch.length) {
        let elementName = elementMatch[1];
        let attributeName = attributeMatch[1];
        let bindingName = attributeMatch[2];
        return this.attributeValueCompletionFactory.create(elementName, attributeName, bindingName);
      }
    }

    return null;
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
