export class StringUtils {
  public static replaceAll(
    input: string,
    searchValue: string,
    replaceValue: string
  ) {
    const searchRegex = new RegExp(searchValue, 'g');
    const result = input.replace(searchRegex, () => {
      return replaceValue;
    });
    return result;
  }

  public static insert(
    str: string | undefined,
    index: number,
    value: string | undefined
  ): string {
    if (str == null) return '';
    if (value == null) return '';

    const ind = index < 0 ? this.length + index : index;
    return str.substr(0, ind) + value + str.substr(ind);
  }
}
