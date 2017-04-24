import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem, Position } from 'vscode-languageserver-types';
import AttributeCompletionFactory from './Completions/AttributeCompletionFactory';
import ElementCompletionFactory from './Completions/ElementCompletionFactory';
import AttributeValueCompletionFactory from './Completions/AttributeValueCompletionFactory';
import BindingCompletionFactory from './Completions/BindingCompletionFactory';
import EmmetCompletionFactory from './Completions/EmmetCompletionFactory';
import { DocumentParser, TagDefinition } from './DocumentParser';

@autoinject()
export default class CompletionItemFactory {

  constructor(
    private attributeCompletionFactory: AttributeCompletionFactory,
    private elementCompletionFactory: ElementCompletionFactory,
    private attributeValueCompletionFactory: AttributeValueCompletionFactory,
    private bindingCompletionFactory: BindingCompletionFactory,
    private emmetCompletionFactory: EmmetCompletionFactory,
    private parser: DocumentParser) { }

  public async create(
    triggerCharacter: string,
    position: Position,    
    text: string,
    positionNumber: number,
    uri: string): Promise<Array<CompletionItem>> {

      let nodes = await this.parser.parse(text);     
      let insideTag: TagDefinition = null;
      let lastIdx = 0;

      // get insidetag and last index of tag
      for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (!insideTag && positionNumber >= node.startOffset && positionNumber <= node.endOffset) {
          insideTag = node;
        }
        if (node !== insideTag && node.endOffset > positionNumber) {
          lastIdx = i;
          break;
        }
      }

      // get open parent tag
      let tags = this.getOpenHtmlTags(nodes, lastIdx);
      let parentTag = tags[tags.length - 1];

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
        case '[':
          return this.createEmmetCompletion(text, positionNumber);
        case '<':
          return this.elementCompletionFactory.create(parentTag);
      }
  }

  private getOpenHtmlTags(nodes: Array<TagDefinition>, lastIdx: number) {
    let tags: Array<string> = [];
    for(let i = 0; i < lastIdx; i++) {
      if (nodes[i].startTag) {
        tags.push(nodes[i].name);
      } else {
        var index = tags.indexOf(nodes[i].name);
        if (index >= 0) {
          tags.splice( index, 1 );
        }          
      }
    }
    return tags;
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
    const emmetRegex = /([\w|-]*)\[$/g
    let matches = emmetRegex.exec(text.substring(0, position));
    let elementName = matches[1];
    return this.emmetCompletionFactory.create(elementName);
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
