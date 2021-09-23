import { ViewRegionInfo } from '../../feature/embeddedLanguages/embeddedSupport';
import { whiteSpaceRegex, WORD_SEPARATORS } from '../constants';

export function findSourceWord(region: ViewRegionInfo, offset: number): string {
  if (region.startOffset === undefined) return '';

  // ?? ?? custom element
  const input = region.attributeValue ?? region.regionValue ?? region.tagName;
  if (!input) return '';

  const normalizedOffset = Math.abs(region.startOffset - offset);
  const word = getWordAtOffset(input, normalizedOffset);

  return word;
}

/**
 * At a given offset get the underlying word
 *
 * @example
 * const str = 'hi |: on';
 * getWordAtOffset(str, 0); // hi
 * getWordAtOffset(str, 1); // hi
 * getWordAtOffset(str, 2); // ''
 * getWordAtOffset(str, 3); // ''
 * getWordAtOffset(str, 4); // ''
 * getWordAtOffset(str, 5); // ''
 * getWordAtOffset(str, 6); // on
 * getWordAtOffset(str, 7); // on
 */
function getWordAtOffset(input: string, offset: number): string {
  if (isNonWordCharacter(input[offset])) {
    return '';
  }

  const wordStartIndex = getBackwardNonWordIndex(input, offset);
  const wordEndIndex = getForwardNonWordIndex(input, offset);
  const word = input.substring(wordStartIndex, wordEndIndex + 1);
  return word;
}

function isNonWordCharacter(char: string): boolean {
  const isWordSeparator = WORD_SEPARATORS.includes(char);
  const isWhiteSpace = whiteSpaceRegex.exec(char);
  const isNonWord = isWhiteSpace !== null || isWordSeparator;
  return isNonWord;
}

function getForwardNonWordIndex(input: string, offset: number) {
  let wordEndIndex = input.length - 1;
  for (let fIndex = offset; fIndex <= input.length; fIndex += 1) {
    if (isNonWordCharacter(input[fIndex])) {
      wordEndIndex = fIndex - 1;
      break;
    }
  }
  return wordEndIndex;
}

function getBackwardNonWordIndex(input: string, offset: number) {
  let wordStartIndex = 0;
  for (let bIndex = offset; bIndex >= 0; bIndex -= 1) {
    if (isNonWordCharacter(input[bIndex])) {
      wordStartIndex = bIndex + 1;
      break;
    }
  }
  return wordStartIndex;
}
