export class OffsetUtils {
  public static isIncluded(
    startOffset: number,
    endOffset: number,
    targetOffset: number
  ) {
    const result = startOffset <= targetOffset && targetOffset <= endOffset;
    return result;
  }
}
