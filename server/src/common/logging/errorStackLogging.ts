/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
let globalIndex = 0;

export function generateDependencyTree(input: string[][]) {
  const tracker = {};
  let trackerIndex = 0;
  input.forEach((rawList) => {
    globalIndex++;
    generateRecursive(tracker, trackerIndex, rawList);
    trackerIndex = 0;
  });
  return tracker;
}

/**
 * "Single" - One input at a time (cf. generateDependencyTree, where we input string[][])
 */
export function generateDependencyTreeSingle(
  tracker: unknown,
  input: (string | undefined)[]
) {
  let trackerIndex = 0;
  globalIndex++;
  generateRecursive(tracker, trackerIndex, input);
  trackerIndex = 0;
  return tracker;
}

// type LeafObject = 'leaf' | Record<string, 'leaf'>;
// type LeafObjectRecursive = 'leaf' | Record<string, LeafObject>;

/**
 * @example
 * [['a', 'c'],
 * ['b', 'c']]
 * ->
 * { a: { c: 'leaf' }, b: { c: 'leaf' } }
 * -------
 * [['a', 'b', '1'],
 * ['a', 'c', '2']]
 * ->
 * { a: { b: { 1: 'leaf' }, c: { 2: 'leaf' } } }
 */
function generateRecursive(
  tracker: any,
  index: number,
  rawList: (string | undefined)[]
) {
  // - 1. Recursive guard. We are at the end.
  if (index === rawList.length) return;

  const trackerEntries = Object.entries(tracker);
  const currentKey = rawList[index];
  if (currentKey == null) return;

  // - 2. Very first iteration
  if (trackerEntries.length === 0) {
    tracker[currentKey] = 'leaf';
    generateRecursive(tracker, index + 1, rawList);
    return;
  }

  // - 3. Continue next step if has same parent
  // - 4. Add if not present
  else if (index === 0) {
    const hasSameParent = tracker[currentKey];
    if (hasSameParent === true) {
      // - 3. Continue next step if has same parent
      generateRecursive(tracker[currentKey], index + 1, rawList);
    }

    const isPresent = tracker[currentKey];
    if (!isPresent) {
      // - 4. Add if not present
      // { a } -> { a, b }
      // - 4.1. Initial: [
      //                   ['a', 'b'],
      //                   ['a', 'c']
      //                 ]
      // - 4.2. Path:    { a: 'leaf' }
      // - 4.3. Add:     { a: 'leaf', b: 'leaf' }
      tracker[currentKey] = 'leaf';
      generateRecursive(tracker, index + 1, rawList);
      return;
    }
  }
  // - 5. Append to existing
  // - 6. Continue, if nothing more in path
  // - 7. Add to existing (not root)
  else if (index !== 0) {
    const previousKey = rawList[index - 1];
    if (previousKey == null) return;

    trackerEntries.forEach(([trackerKey, trackerValue]) => {
      if (trackerKey === previousKey) {
        if (trackerValue === 'leaf') {
          // - 5. Append to existing
          // { a } -> { a : { b } }
          // - 5.1. Initial: [
          //                   ['a', 'b'],
          //                   ['a', 'c']
          //                 ]
          // - 5.2. Path:    { a: 'leaf', b: 'leaf' }
          // - 5.3. Append:  { a: 'leaf', b: { c: 'leaf' } }
          tracker[trackerKey] = { [currentKey]: 'leaf' };
          generateRecursive(tracker[trackerKey], index + 1, rawList);
          return;
        }
      } else if (trackerKey === currentKey) {
        // - 6. Continue, if nothing more in path
        // - 6.1. Initial: [
        //                   ['a', 'b', 'c'],
        //                   ['a', 'b'],   // <- here
        //                 ]
        // - 6.2. Path:    { b: 'leaf', c: 'leaf' }
        generateRecursive(tracker[currentKey], index + 1, rawList);
      } else {
        if (tracker[previousKey] !== 'leaf') {
          // - 7. Add to existing (not root)
          // - 7.1. Initial: [
          //                   ['a', 'b', 'c'],
          //                   ['a', 'b', 'd'],   // <- here
          //                 ]
          // - 7.2. Path:    { c: 'leaf' }
          // - 7.2. Path:    { c: { d: 'leaf' } }
          tracker[currentKey] = 'leaf';
          generateRecursive(tracker, index + 1, rawList);
          return;
        }
      }
    });
  } else {
    console.log('unreachable');
  }
}
