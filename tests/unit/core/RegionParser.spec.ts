/* eslint-disable no-template-curly-in-string */
import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionParser } from '../../../server/src/core/regions/RegionParser';

type TestCase = [
  string /* code */,
  string[]? /* accessScopes */,
  string[]? /* nameLocation (from parseExpression) */
];
interface TestCasesMap {
  [description: string]: TestCase[];
}

const testCasesMap: TestCasesMap = {};
/* prettier-ignore */
testCasesMap['Should #parse'] = [
  // code                                                        , [accessScopeNames    , [nameLocations
  ['<p id.bind="foo"></p>'                                       , ['foo']              , ['12;15']] ,
  ['<p>${foo}</p>'                                               , ['foo'] ,['5;8']] ,
  ['<p>\n  ${foo}</p>'                                           , ['foo']              , ['9;12']] ,
  ['<p>\n\n  ${foo}</p>'                                         , ['foo']              , ['11;14']] ,
  ['<p>\n\n  ${foo} ${bar}</p>'                                  , ['foo','bar']        , ['11;14' ,'18;21']] ,
  ['<p>\n  ${foo}\n  ${bar}</p>'                                 , ['foo','bar']        , ['9;12' ,'19;22']] ,
  ['<p>\n\n  ${foo} ${bar}\n  ${qux}</p>'                        , ['foo','bar','qux']  , ['11;14' ,'18;21' ,'28;31']] ,
  ['<p repeat.for="person of people"></p>'                       , ['people']] ,
  ['<p repeat.for="p of people | foo:bar & qux:\'zed\'"></p>'    , ['people;bar'] , ] ,
  // code                                                        , [accessScopeNames    , [nameLocations
];
const testCasesMapNot: TestCasesMap = {};
testCasesMapNot['Should not #parse'] = [['<a href=""></a>']];

describe('RegionParser.', () => {
  describe.only('', () => {
    Object.entries(testCasesMap).forEach(([description, testCases]) => {
      describe(description, () => {
        testCases.forEach((testCase) => {
          const [code, rawExpectedAccessScopes, rawExpectedNameLocation] =
            testCase;
          it(code, () => {
            const document = TextDocument.create('', '', 0, code);
            const parsedRegions = RegionParser.parse(document, []);
            parsedRegions.forEach((region, regionIndex) => {
              const resultNames = region.accessScopes?.map(
                (scope) => scope.name
              );
              if (!resultNames) return;
              if (rawExpectedAccessScopes == null) return;
              const expectedAccessScopes =
                rawExpectedAccessScopes[regionIndex].split(';');
              expect(resultNames).toEqual(expectedAccessScopes);

              if (rawExpectedNameLocation == null) return;
              if (rawExpectedNameLocation.length === 0) return;
              region.accessScopes?.forEach((scope) => {
                const expectedNameLocation =
                  rawExpectedNameLocation[regionIndex].split(';');
                const [expectedStart, expectedEnd] = expectedNameLocation;
                const { start, end } = scope.nameLocation;
                expect(start).toEqual(Number(expectedStart));
                expect(end).toEqual(Number(expectedEnd));
              });
            });
            // expect(true).toBeFalsy();
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
