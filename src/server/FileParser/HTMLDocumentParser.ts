import { AST, SAXParser, MarkupData } from 'parse5';
import { Readable } from 'stream';
import { Location } from 'vscode-languageserver/lib/main';

export class HTMLDocumentParser {

  public parse(text: string): Promise<TagDefinition[]> {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(text);
      stream.push(null);

      const stack: TagDefinition[] = [];

      const parser = new SAXParser({ locationInfo: true });
      parser.on('startTag', (name, attrs, selfClosing, location) => {
        stack.push(new TagDefinition(
          true,
          name,
          location.startOffset,
          location.endOffset,
          location.line,
          selfClosing,
          attrs.map(i => new AttributeDefinition(i.name, i.value, location.attrs[i.name]))));
      });
      parser.on("endTag", (name, location) => {
        stack.push(new TagDefinition(
          false,
          name,
          location.startOffset,
          location.endOffset,
          location.line,
        ));
      });

      stream.on('end', x => {
        resolve(stack);
      });
      stream.pipe(parser);

    });
  }

  public getElementAtPosition(text: string, start: number, end: number): Promise<TagDefinition> {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(text);
      stream.push(null);

      let tagDefinition: TagDefinition;

      const parser = new SAXParser({ locationInfo: true });
      parser.on('startTag', (name, attrs, selfClosing, location) => {

        if (location.startOffset <= start && location.endOffset >= end) {
          tagDefinition = new TagDefinition(
            true,
            name,
            location.startOffset,
            location.endOffset,
            location.line,
            selfClosing,
            attrs.map(i => new AttributeDefinition(i.name, i.value, location.attrs[i.name])));
        }
      });

      stream.on('end', x => {
        resolve(tagDefinition);
      });
      stream.pipe(parser);
    });
  }

}

export class TagDefinition {
  constructor(
    public startTag: boolean,
    public name: string,
    public startOffset: number,
    public endOffset: number,
    public line: number,
    public selfClosing: boolean = null,
    public attributes: AttributeDefinition[] = []) {
  }
}
export class AttributeDefinition {

  public name: string;
  public binding: string;

  public endOffset: number;
  public startOffset: number;

  constructor(name: string, public value: string, location?: MarkupData.Location) {
    if (name) {
      const parts = name.split('.');
      if (parts.length == 2) {
        this.name = parts[0];
        this.binding = parts[1];
      } else {
        this.name = name;
      }
    }

    if (location) {
      this.startOffset = location.startOffset;
      this.endOffset = location.endOffset;
    }
  }
}
