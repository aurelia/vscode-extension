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
}
