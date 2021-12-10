export class OffsetUtils {
  public static isIncluded(
    startOffset: number,
    endOffset: number,
    targetOffset: number | undefined
  ) {
    if (targetOffset == null) return false;

    const result = startOffset <= targetOffset && targetOffset <= endOffset;
    return result;
  }
}
