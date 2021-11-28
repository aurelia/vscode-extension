import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionParser } from '../../../server/src/core/regions/RegionParser';

type TestCase = [string /* code */, string[]? /* accessScopes */];
interface TestCasesMap {
  [description: string]: TestCase[];
}

const testCasesMap: TestCasesMap = {};
testCasesMap['Should #parse'] = [
  // [`<p repeat.for="person of people"></p>`, ['people']],
  [
    `<p repeat.for="person of people | filterEmployed:employmentStatus & signal:'change'"></p>`,
    ['people', 'employmentStatus'],
  ],
];
const testCasesMapNot: TestCasesMap = {};
testCasesMapNot['Should not #parse'] = [['<a href=""></a>']];

describe('RegionParser.', () => {
  describe.only('', () => {
    Object.entries(testCasesMap).forEach(([description, testCases]) => {
      describe(description, () => {
        testCases.forEach((testCase) => {
          const [code, targetAccessScopes] = testCase;
          it(code, () => {
            const document = TextDocument.create('', '', 0, code);
            const parsedRegions = RegionParser.parse(document, []);
            parsedRegions.forEach((region) => {
              const resultNames = region.accessScopes?.map(
                (scope) => scope.name
              );
              if (!resultNames) return;
              expect(resultNames).toEqual(targetAccessScopes);
            });
          });
        });
      });
    });
  });

  describe('Should not #parse', () => {
    Object.entries(testCasesMapNot).forEach(([description, testCases]) => {
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
});
