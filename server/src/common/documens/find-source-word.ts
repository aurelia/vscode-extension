import { AbstractRegion } from '../../aot/parser/regions/ViewRegions';
import { whiteSpaceRegex, WORD_SEPARATORS } from '../constants';

interface WordInfo {
  startOffset: number;
  endOffset: number;
  word: string;
}

export function findSourceWord(region: AbstractRegion, offset: number): string {
  if (region.sourceCodeLocation.startOffset === undefined) return '';

  // ?? ?? custom element
  const input =
    // eslint-disable-next-line
    region.regionValue ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    region.attributeValue ||
    region.tagName ||
    region.textValue;
  if (input === undefined) return '';

  const normalizedOffset = Math.abs(
    region.sourceCodeLocation.startOffset - offset
  );
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
 * getWordAtOffset(str, 2); // hi
 * getWordAtOffset(str, 3); // ''
 * getWordAtOffset(str, 4); // ''
 * getWordAtOffset(str, 5); // ''
 * getWordAtOffset(str, 6); // on
 * getWordAtOffset(str, 7); // on
 * getWordAtOffset(str, 8); // on
 */
export function getWordAtOffset(input: string, offset: number): string {
  return getWordInfoAtOffset(input, offset).word;
}

// const input =
//   '' +
//   `@customElement({ name: 'custom-element', template })
// export class CustomElementCustomElement {
//   @bindable foo;
//   @bindable bar;
//   qux;

//   useFoo() {
//     this.foo;
//   }
// }`;
// getWordAtOffset(input, 106); /*?*/

export function getWordInfoAtOffset(input: string, offset: number): WordInfo {
  if (isNonWordCharacter(input[offset])) {
    const offsetPrevious = offset - 1;
    if (!isNonWordCharacter(input[offsetPrevious])) {
      offset = offsetPrevious;
    } else {
      return { startOffset: NaN, endOffset: NaN, word: '' };
    }
  }

  const wordStartIndex = getBackwardNonWordIndex(input, offset);
  const wordEndIndex = getForwardNonWordIndex(input, offset);
  const word = input.substring(wordStartIndex, wordEndIndex + 1);

  return {
    startOffset: wordStartIndex,
    endOffset: wordEndIndex,
    word,
  };
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
