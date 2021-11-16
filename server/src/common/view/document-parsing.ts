import SaxStream, { StartTagToken } from 'parse5-sax-parser';
import { TextDocument } from 'vscode-html-languageservice';

export class ParseHtml {
  public static parseHtmlStartTags(content: string) {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });
    const allStartTag: StartTagToken[] = [];

    saxStream.on('startTag', (startTag: StartTagToken) => {
      allStartTag.push(startTag);
    });

    saxStream.write(content);

    return allStartTag;
  }

  public static findTagAtOffset(content: string, offset: number) {
    const parsedTags = this.parseHtmlStartTags(content);
    const target = parsedTags.find((tag) => {
      if (tag.sourceCodeLocation === undefined) return false;

      const isStart = tag.sourceCodeLocation.startOffset <= offset;
      const isEnd = offset <= tag.sourceCodeLocation.endOffset;
      const isAt = isStart && isEnd;
      // parsePoint.attrs
      return isAt;
    });

    return target;
  }

  public static findAttributeAtOffset(
    content: string,
    offset: number,
    attributeName: string
  ) {
    const targetTag = this.findTagAtOffset(content, offset);
    const targetAttribute = targetTag?.sourceCodeLocation?.attrs[attributeName];
    if (targetAttribute === undefined) return;

    const isStart = targetAttribute.startOffset <= offset;
    const isEnd = offset <= targetAttribute.endOffset;
    const verifiedLocation = isStart && isEnd;
    if (verifiedLocation === false) return;

    return targetAttribute;
  }
}

/**
 *
 */
export function checkInsideTag(
  document: TextDocument,
  offset: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });

    saxStream.on('startTag', (startTag) => {
      const startOffset = startTag.sourceCodeLocation?.startOffset;
      const endOffset = startTag.sourceCodeLocation?.endOffset;
      if (startOffset === undefined) return;
      if (endOffset === undefined) return;

      const isInsideTag = startOffset <= offset && offset <= endOffset;

      if (isInsideTag) {
        saxStream.stop();
        resolve(true);
      }

      const isTagAfterOffset = offset <= startOffset;
      if (isTagAfterOffset) {
        saxStream.stop();
        resolve(false);
      }
    });

    saxStream.write(document.getText());
    resolve(false);
  });
}
