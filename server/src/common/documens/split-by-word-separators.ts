import { WORD_SEPARATORS_REGEX_STRING } from '../constants';

export function splitByWordSeparators(input: string) {
  const whiteSpaceRegex = '\\s\\r\\n\\t';
  const myRegex = new RegExp(
    `[${WORD_SEPARATORS_REGEX_STRING}${whiteSpaceRegex}]`,
    'i'
  );
  const split = input.split(myRegex).filter((_string) => _string !== '');
  return split;
}
