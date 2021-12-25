export class OffsetUtils {
  public static isIncluded(
    startOffset: number | undefined,
    endOffset: number | undefined,
    targetOffset: number | undefined
  ) {
    if (startOffset == null) return false;
    if (endOffset == null) return false;
    if (targetOffset == null) return false;

    const isStart = startOffset <= targetOffset;
    const isEnd = targetOffset <= endOffset;
    const result = isStart && isEnd;
    return result;
  }
}
