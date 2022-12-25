import { generateDependencyTree } from '../../../../server/src/common/logging/errorStackLogging';

describe('generateDependencyTree', () => {
  describe('Same length input.', () => {
    describe('Same parent', () => {
      it('correct tree 1', () => {
        const input = [
          ['a', 'b'],
          ['a', 'c'],
        ];
        const result = generateDependencyTree(input);
        expect(result).toEqual({ a: { b: 'leaf', c: 'leaf' } });
      });

      it('correct tree 2', () => {
        const input = [
          ['a', 'b', '1'],
          ['a', 'c', '2'],
        ];
        const result = generateDependencyTree(input);
        expect(result).toEqual({
          a: { b: { 1: 'leaf' }, c: { 2: 'leaf' } },
        });
      });
    });

    describe('Same parent', () => {
      it('correct tree 1', () => {
        const input = [
          ['a', 'c'],
          ['b', 'c'],
        ];
        const result = generateDependencyTree(input);
        expect(result).toEqual({ a: { c: 'leaf' }, b: { c: 'leaf' } });
      });
      it('correct tree 2', () => {
        const input = [
          ['a', 'b', 'c'],
          ['a', 'b'],
        ];
        const result = generateDependencyTree(input);
        // expect(result).toEqual({ a: { c: 'leaf' }, b: { c: 'leaf' } });
        expect(result).toEqual({ a: { b: { c: 'leaf' } } });
      });
      it('correct tree 3', () => {
        const input = [
          ['a', 'b', 'c'],
          ['a', 'b', 'd'],
        ];
        const result = generateDependencyTree(input);
        expect(result).toEqual({ a: { b: { c: 'leaf', d: 'leaf' } } });
      });
    });
  });

  describe('Different length input.', () => {
    it('correct tree 1', () => {
      const input = [['a'], ['b', 'c']];
      const result = generateDependencyTree(input);
      expect(result).toEqual({
        a: 'leaf',
        b: { c: 'leaf' },
      });
    });

    it('correct tree 2', () => {
      const input = [['b', 'c'], ['a']];
      const result = generateDependencyTree(input);
      expect(result).toEqual({
        a: 'leaf',
        b: { c: 'leaf' },
      });
    });
  });
});
