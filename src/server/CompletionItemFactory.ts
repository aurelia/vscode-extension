import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem, Position } from 'vscode-languageserver-types';
import AttributeCompletionFactory from './Completions/AttributeCompletionFactory';
import AttributeValueCompletionFactory from './Completions/AttributeValueCompletionFactory';

@autoinject()
export default class CompletionItemFactory {

  constructor(
    private attributeCompletionFactory: AttributeCompletionFactory,
    private attributeValueCompletionFactory: AttributeValueCompletionFactory) { }

  public create(
    triggerCharacter: string,
    position: Position,    
    text: string,
    positionNumber: number,
    uri: string): Array<CompletionItem> {

    switch (triggerCharacter) {
      case ' ':
        return this.createAttributeCompletion(text, positionNumber);
      case '<':
        return this.createElementCompletion(text, positionNumber);
      case '[':
        return this.createEmmetCompletion(text, positionNumber);
      case '.':
        return this.createBindingCompletion(text, positionNumber);
      case '"':
      case '\'':
        return this.createValueCompletion(text, positionNumber);
      default:
        return [];
    }
  }

  private elementMatch = /<([a-zA-Z-]*)\s([^<]*)$/;
  private attributeMatch = /([a-zA-Z-]*)\.?([a-zA-Z-]*)?=['"]$/;
  private attributeSplitterMatch = /(\S[^\. ]+)(\.(\S+))?=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;

  private createAttributeCompletion(text: string, positionNumber: number): Array<CompletionItem> {
    let nextCharacter = text.substring(positionNumber, positionNumber + 1);
    if (nextCharacter === '>' || /\s/.test(nextCharacter)) {
      let elementMatch = this.elementMatch.exec(text.substring(0, positionNumber));
      if (elementMatch !== null && elementMatch.length) {
        let elementName = elementMatch[1];

        let existingAttributes = [];
        let matchResult;

        let nextSplitted = text.substring(positionNumber, text.length).split('>');
        while(matchResult = this.attributeSplitterMatch.exec(nextSplitted[0])) {
          existingAttributes.push(matchResult[1]);
        }

        let previousSplitted = text.substring(0, positionNumber).split('<');
        while(matchResult = this.attributeSplitterMatch.exec(previousSplitted[previousSplitted.length - 1])) {
          existingAttributes.push(matchResult[1]);
        }

        return this.attributeCompletionFactory.create(elementName, existingAttributes);
      }
    }

    return null;
  }

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

  private createElementCompletion(text: string, position: number) {
    return null;
  }

  private createEmmetCompletion(text: string, position: number) {
    return null;
  }

  private createBindingCompletion(text: string, position: number) {
    return null;
  }
}
