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
