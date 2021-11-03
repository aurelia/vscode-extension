import { Position } from 'vscode-languageserver-textdocument';

export class OffsetUtils {
  static isIncluded(
    startOffset: number,
    endOffset: number,
    targetOffset: number
  ) {
    const result = startOffset <= targetOffset && targetOffset <= endOffset;
    startOffset; /*?*/
    endOffset; /*?*/
    return result;
  }
}
