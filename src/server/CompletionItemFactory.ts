import { AureliaApplication } from './FileParser/Model/AureliaApplication';
import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem, Position } from 'vscode-languageserver';
import AttributeCompletionFactory from './Completions/AttributeCompletionFactory';
import ElementCompletionFactory from './Completions/ElementCompletionFactory';
import CustomElementCompletionFactory from './Completions/CustomElementCompletionFactory';
import AttributeValueCompletionFactory from './Completions/AttributeValueCompletionFactory';
import BindingCompletionFactory from './Completions/BindingCompletionFactory';
import EmmetCompletionFactory from './Completions/EmmetCompletionFactory';
import { HTMLDocumentParser, TagDefinition, AttributeDefinition } from './FileParser/HTMLDocumentParser';
import ViewModelVariablesCompletionFactory from './Completions/ViewModelVariablesCompletionFactory';
import ViewModelViewAttributesCompletionFactory from './Completions/ViewModelViewAttributesCompletionFactory';
import { Uri } from 'vscode';

@autoinject()
export default class CompletionItemFactory {

  public constructor(
    private readonly attributeCompletionFactory: AttributeCompletionFactory,
    private readonly elementCompletionFactory: ElementCompletionFactory,
    private readonly customElementCompletionFactory: CustomElementCompletionFactory,
    private readonly attributeValueCompletionFactory: AttributeValueCompletionFactory,
    private readonly bindingCompletionFactory: BindingCompletionFactory,
    private readonly emmetCompletionFactory: EmmetCompletionFactory,
    private readonly viewModelVariablesCompletionFactory: ViewModelVariablesCompletionFactory,
    private readonly viewModelViewAttributesCompletionFactory: ViewModelViewAttributesCompletionFactory,
    private readonly parser: HTMLDocumentParser) { }

  public async create(
    triggerCharacter: string,
    position: Position,
    text: string,
    positionNumber: number,
    uri: any,
    aureliaApplication: AureliaApplication): Promise<CompletionItem[]> {

    const nodes = await this.parser.parse(text);
    let insideTag: TagDefinition = null;
    let lastIdx = 0;

    // get insidetag and last index of tag
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!insideTag && positionNumber >= node.startOffset && positionNumber <= node.endOffset) {
        insideTag = node;
      }
      if (node !== insideTag && node.endOffset > positionNumber) {
        lastIdx = i;
        break;
      }
    }

    // get open parent tag
    const tags = this.getOpenHtmlTags(nodes, lastIdx);
    const parentTag = tags[tags.length - 1];

    // auto complete inside a tag
    if (insideTag) {

      const elementString = text.substring(insideTag.startOffset, positionNumber);
      if (this.notInAttributeValue(elementString)) {

        if (triggerCharacter === ' ') {
          return this.attributeCompletionFactory.create(insideTag.name, insideTag.attributes.map(i => i.name), aureliaApplication);
        } else if (triggerCharacter === '.' && this.canExpandDot(elementString)) {
          return this.createBindingCompletion(insideTag, text, positionNumber);
        } else {
          return [];
        }
        // inside attribute, perform attribute completion
      } else if (triggerCharacter === '"' || triggerCharacter === '\'') {
        return this.createValueCompletion(insideTag, text, positionNumber, uri);
      } else {
        return [];
      }
    } else if (triggerCharacter === '{') {
      return this.viewModelVariablesCompletionFactory.create(uri);
    }

    // auto complete others
    switch (triggerCharacter) {
      case '[':
        return this.createEmmetCompletion(text, positionNumber);
      case '<': {
        const customElementResult = this.customElementCompletionFactory.create('', aureliaApplication);
        const elementResult = this.elementCompletionFactory.create(parentTag);
        return customElementResult.concat(elementResult);
      }
    }
  }

  private notInAttributeValue(tagText: string) {
    let single = 0, double = 0;
    for (const char of tagText) {
      if (char === '"') double += 1;
      if (char === '\'') single += 1;
    }
    return single % 2 === 0 && double % 2 === 0;
  }

  private canExpandDot(elementString) {
    return !/([^a-zA-Z]|\.(bind|one-way|two-way|one-time|from-view|to-view|delegate|trigger|call|capture|ref))\.$/g.test(elementString);
  }

  private getOpenHtmlTags(nodes: TagDefinition[], lastIdx: number) {
    const tags: string[] = [];
    for (let i = 0; i < lastIdx; i++) {
      if (nodes[i].startTag) {
        tags.push(nodes[i].name);
      } else {
        const index = tags.indexOf(nodes[i].name);
        if (index >= 0) {
          tags.splice(index, 1);
        }
      }
    }
    return tags;
  }

  private createValueCompletion(tag: TagDefinition, text: string, position: number, uri: Uri) {
    const nextCharacter = text.substring(position, position + 1);
    if (/['"]/.test(nextCharacter)) {
      let attribute;
      const elementText = text.substring(tag.startOffset, tag.endOffset);
      const tagPosition = position - tag.startOffset;
      const attributeRegex = /([\w-]+)\.?\w*=['"]/g;
      let matches: RegExpExecArray;
      // eslint-disable-next-line
      while (matches = attributeRegex.exec(elementText)) {
        if (tagPosition >= matches.index && (tagPosition <= matches.index + matches[0].length)) {
          const foundText = matches[1];
          const attributes = tag.attributes.filter(a => a?.name === foundText);
          if (attributes.length > 0) {
            attribute = attributes[0];
            break;
          }
        }
      }
      if (!attribute) {
        return [];
      }
      return this.attributeValueCompletionFactory.create(tag.name, attribute.name, attribute.binding, uri);
    }
  }

  private createEmmetCompletion(text: string, position: number) {
    const emmetRegex = /^([^<]*?>)*?([\w|-]*)\[$/gm;
    const matches = emmetRegex.exec(text.substring(0, position));
    if (!matches) {
      return [];
    }
    const elementName = matches[2];
    return this.emmetCompletionFactory.create(elementName);
  }

  private createBindingCompletion(tag: TagDefinition, text: string, position: number) {
    let attribute;
    const elementText = text.substring(tag.startOffset, tag.endOffset);
    const tagPosition = position - tag.startOffset;
    const attributeRegex = /([\w.-]+)(=['"](.*?)["'])?/g;
    let matches: RegExpExecArray;
    let foundText = '';
    // eslint-disable-next-line
    while (matches = attributeRegex.exec(elementText)) {
      if (tagPosition >= matches.index && (tagPosition <= matches.index + matches[1].length)) {
        foundText = matches[1];
        const attributes = tag.attributes.filter(a => a.name + (a.binding !== undefined ? '.' : '') === foundText);
        if (attributes.length > 0) {
          attribute = attributes[0];
          break;
        }
      }
    }
    if (!attribute) {
      attribute = new AttributeDefinition(foundText.substring(0, foundText.length - 1), '');
    }
    return this.bindingCompletionFactory.create(tag, attribute, text.substring(position, position + 1));
  }
}
