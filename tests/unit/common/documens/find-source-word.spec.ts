import { getWordAtOffset } from '../../../../server/src/common/documens/find-source-word';
import { splitByWordSeparators } from '../../../../server/src/common/documens/split-by-word-separators';

describe('splitByWordSeparators', () => {
  it('split correctly 1', () => {
    const input = 'repo of repos | sort:column.value:direction.value | take:10';
    const result = splitByWordSeparators(input);
    // prettier-ignore
    expect(result).toEqual([ 'repo', 'of', 'repos', 'sort', 'column', 'value', 'direction', 'value', 'take', '10', ]);
  });
  it('split correctly 1', () => {
    const input = 'increaseCounter()';
    const result = splitByWordSeparators(input);
    expect(result).toEqual(['increaseCounter']);
  });
});

describe.only('', () => {
  it('correct', () => {
    const str = 'hi |: on';
    expect(getWordAtOffset(str, 0)).toBe('hi');
    expect(getWordAtOffset(str, 1)).toBe('hi');
    expect(getWordAtOffset(str, 2)).toBe('hi');
    expect(getWordAtOffset(str, 3)).toBe('');
    expect(getWordAtOffset(str, 4)).toBe('');
    expect(getWordAtOffset(str, 5)).toBe('');
    expect(getWordAtOffset(str, 6)).toBe('on');
    expect(getWordAtOffset(str, 7)).toBe('on');
    expect(getWordAtOffset(str, 8)).toBe('on');
  });
});
