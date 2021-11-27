import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionParser } from '../../../server/src/core/regions/RegionParser';

interface TestCasesMap {
  [description: string]: string[][];
}

const testCasesMap: TestCasesMap = {};
testCasesMap['Should not #parse'] = [['<a href=""></a>']];

describe('RegionParser.', () => {
  Object.entries(testCasesMap).forEach(([description, testCases]) => {
    describe(description, () => {
      testCases.forEach((testCase) => {
        const [code] = testCase;
        it(code, () => {
          const document = TextDocument.create('', '', 0, code);
          const parsedRegions = RegionParser.parse(document, []);
          expect(parsedRegions.length).toBe(0);
        });
      });
    });
  });
});
