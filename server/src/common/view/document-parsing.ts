import { Location } from 'parse5';
import SaxStream, { StartTagToken, CommentToken } from 'parse5-sax-parser';
import { TextDocument } from 'vscode-html-languageservice';
import { AureliaView } from '../constants';
import { OffsetUtils } from '../documens/OffsetUtils';

export class ParseHtml {
  public static findTagAtOffset(content: string, offset: number) {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });
    let targetStartTag: StartTagToken | undefined;

    saxStream.on('startTag', (startTag: StartTagToken) => {
      const { startOffset, endOffset } = startTag.sourceCodeLocation ?? {};
      const isAt = OffsetUtils.isIncluded(startOffset, endOffset, offset);
      if (isAt) {
        targetStartTag = startTag;
      }
      return isAt;
    });

    saxStream.write(content);

    return targetStartTag;
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

  public static findAttributeValueAtOffset(content: string, offset: number) {
    const targetTag = this.findTagAtOffset(content, offset);

    const targetAttributeLocation: [string, Location] | undefined =
      Object.entries(targetTag?.sourceCodeLocation?.attrs ?? {}).find(
        ([attributeName, location]) => {
          const attrStart =
            location.startOffset +
            attributeName.length + // >attr<=""
            2; // ="
          const attrEnd = location.endOffset - 1; // - 1: '"'
          const verifiedLocation = OffsetUtils.isIncluded(
            attrStart,
            attrEnd,
            offset
          );

          return verifiedLocation;
        }
      );

    return targetAttributeLocation;
  }

  public static findCommentAtOffset(content: string, offset: number) {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });
    let targetComment: CommentToken | undefined;

    saxStream.on('comment', (comment: CommentToken) => {
      const { startOffset, endOffset } = comment.sourceCodeLocation ?? {};
      const isOffsetIncluded = OffsetUtils.isIncluded(
        startOffset,
        endOffset,
        offset
      );
      if (isOffsetIncluded) {
        targetComment = comment;
        saxStream.stop();
      }
    });

    saxStream.write(content);

    return targetComment;
  }

  /**
   * Au1: https://aurelia.io/docs/templating/html-behaviors#html-only-custom-elements
   * Au2: https://docs.aurelia.io/getting-to-know-aurelia/introduction/local-templates
   */
  public static isHtmlWithRootTemplate(content: string) {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });
    let _isHtmlWithRootTemplate = false;

    saxStream.on('startTag', (startTag: StartTagToken) => {
      if (startTag.tagName === AureliaView.TEMPLATE_TAG_NAME) {
        _isHtmlWithRootTemplate = true;
        saxStream.stop();
      }
    });

    saxStream.write(content);

    return _isHtmlWithRootTemplate;
  }

  private static parseHtmlStartTags(content: string) {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });
    const allStartTag: StartTagToken[] = [];

    saxStream.on('startTag', (startTag: StartTagToken) => {
      allStartTag.push(startTag);
    });

    saxStream.write(content);

    return allStartTag;
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
