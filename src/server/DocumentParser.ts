import { AST, SAXParser } from 'parse5'; 
import { Readable } from 'stream';

export class DocumentParser {

  public parse(text: string): Promise<Array<TagDefinition>> {
    return new Promise((resolve, reject) => {
      let stream = new Readable();
      stream.push(text);
      stream.push(null);

      let stack: Array<TagDefinition> = [];

      const parser = new SAXParser({ locationInfo: true });
      parser.on('startTag', (name, attrs, selfClosing, location) => {
        stack.push(new TagDefinition(
          true, 
          name, 
          location.startOffset, 
          location.endOffset,
          selfClosing,
          attrs.map(i => new AttributeDefinition(i.name, i.value))));
      });
      parser.on("endTag", (name, location) => {
        stack.push(new TagDefinition(
          false,
          name, 
          location.startOffset, 
          location.endOffset));        
      });

      stream.on('end', x => {
        resolve(stack);
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
    public selfClosing: boolean = null,
    public attributes: Array<AttributeDefinition> = []) {
  }
}
export class AttributeDefinition {

  public name: string;
  public binding: string;

  constructor(name: string, public value: string) {
    let parts = name.split('.');
    if (parts.length == 2) {
      this.name = parts[0];
      this.binding = parts[1];
    } else {
      this.name = name;
    }
  }
}
