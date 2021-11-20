export class StringUtils {
  static replaceAll(input: string, searchValue: string, replaceValue: string) {
    const searchRegex = new RegExp(searchValue, 'g');
    const result = input.replace(searchRegex, (match, $1) => {
      return replaceValue;
    });
    return result;
  }
}
