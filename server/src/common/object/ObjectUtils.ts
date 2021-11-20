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
    obj: Record<string, any>,
    keys: (string | undefined)[],
    result: Record<string, any>
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
      this.atPath(obj[key], keys, result[key]);
    });
  }
}
