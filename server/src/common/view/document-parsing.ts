import { TextDocument } from 'vscode-html-languageservice';
import SaxStream from 'parse5-sax-parser';

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
