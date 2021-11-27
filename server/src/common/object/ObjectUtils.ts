export class ObjectUtils {
  /**
   * @example
   * const obj = {
   *   a: {
   *     b: {
   *       c: 'arrived',
   *       d: 'well',
   *     },
   *   },
   * };
   * -- atPath ->
   * { a: { b: { c: 'arrived' } } }
   */
  public static atPath(
    obj: Record<string, unknown>,
    keys: (string | undefined)[],
    result: Record<string, unknown>
  ) {
    if (obj == null) return;

    keys.forEach((key) => {
      if (key == null) return;
      if (obj[key] == null) return;
      if (typeof obj[key] === 'object') {
        result[key] = {};
      } else {
        result[key] = obj[key];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.atPath(obj[key], keys, result[key]);
    });
  }
}
