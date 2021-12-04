import { ExpressionKind } from '../../../server/src/common/@aurelia-runtime-patch/src';
import { ParseExpressionUtil } from '../../../server/src/common/parseExpression/ParseExpressionUtil';
import {
  andImOnTheLine,
  COLLECTION_SPLIT,
  filterTestCaseMap,
  getEmptyShared,
  givenImInTheProject,
  GROUP_SPLIT,
  TestCasesMapFileBased,
  whenIParseTheFile,
} from '../common/testTemplate';

const testCasesMapFileBased: TestCasesMapFileBased = {};

// const input = 'Funding';
// const input = 'Funding ${other}';
// const input = 'arr[qux] | hello';
// const input = 'arr[qux]';
/* prettier-ignore */
testCasesMapFileBased['Offsets'] = [
  // , 'Type , LINE , 'CODE                       , {PARAMETERS
  [{} , 'Many' , NaN , 'foo'                      , {accSco:['foo'] ,nameLoc: ['0;3']} , '' ] ,
  [{} , 'Many' , NaN , 'foo(bar)'                 , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Many' , NaN , 'foo(bar())'               , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Many' , NaN , 'foo(bar(qux))'            , {accSco:['foo!bar!qux'] ,nameLoc: ['0;3!4;7!8;11']} , '' ] ,
  [{} , 'Many' , NaN , 'foo(bar, qux(zed))'       , {accSco:['foo!bar!qux!zed'] ,nameLoc: ['0;3!4;7!9;12!13;16']} , '' ] ,
  [{} , 'Many' , NaN , 'foo("bar", qux(zed))'     , {accSco:['foo!qux!zed'] ,nameLoc: ['0;3!11;14!15;18']} , '' ] ,
  [{} , 'Many' , NaN , 'foo("bar", qux)'          , {accSco:['foo!qux'] ,nameLoc: ['0;3!11;14']} , '' ] ,
  [{} , 'Many' , NaN , 'foo(bar, qux)'            , {accSco:['foo!bar!qux'] ,nameLoc: ['0;3!4;7!9;12']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({bar})'               , {accSco:['foo!bar'] ,nameLoc: ['0;3!5;8']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({ bar})'              , {accSco:['foo!bar'] ,nameLoc: ['0;3!6;9']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({ bar, ok})'          , {accSco:['foo!bar!ok'] ,nameLoc: ['0;3!6;9!11;13']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({ba, quxx})'          , {accSco:['foo!ba!quxx'] ,nameLoc: ['0;3!5;7!9;13']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({bar: qux})'          , {accSco:['foo!qux'] ,nameLoc: ['0;3!10;13']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({bar: 0})[0]'         , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Many' , NaN , 'foo({bar: 0})[0].qux'     , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Many' , NaN , 'foo[bar]'                 , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Many' , NaN , 'foo[0].bar[qux]'          , {accSco:['foo!qux'] ,nameLoc: ['0;3!11;14']} , '' ] ,
  [{} , 'Many' , NaN , 'foo.bar'                  , {accSco:['foo'] ,nameLoc: ['0;3']} , '' ] ,
  [{} , 'Many' , NaN , 'foo.bar[0]'               , {accSco:['foo'] ,nameLoc: ['0;3']} , '' ] ,
  [{} , 'Many' , NaN , 'foo[bar] | bar'           , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,

  // Single Interpolation
  // , 'Type , LINE , 'CODE                       , {PARAMETERS
  [{} , 'Many' , NaN , '${foo}'                   , {accSco:['foo'] ,nameLoc: ['2;5']} , '' ] ,
  [{} , 'Many' , NaN , '${foo(bar)}'              , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'Many' , NaN , '${foo(bar())}'            , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'Many' , NaN , '${foo(bar(qux))}'         , {accSco:['foo!bar!qux'] ,nameLoc: ['2;5!6;9!10;13']} , '' ] ,
  [{} , 'Many' , NaN , '${foo(bar, qux(zed))}'    , {accSco:['foo!bar!qux!zed'] ,nameLoc: ['2;5!6;9!11;14!15;18']} , '' ] ,
  [{} , 'Many' , NaN , '${foo("bar", qux(zed))}'  , {accSco:['foo!qux!zed'] ,nameLoc: ['2;5!13;16!17;20']} , '' ] ,
  [{} , 'Many' , NaN , '${foo("bar", qux)}'       , {accSco:['foo!qux'] ,nameLoc: ['2;5!13;16']} , '' ] ,
  [{} , 'Many' , NaN , '${foo(bar, qux)}'         , {accSco:['foo!bar!qux'] ,nameLoc: ['2;5!6;9!11;14']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({bar})}'            , {accSco:['foo!bar'] ,nameLoc: ['2;5!5;8']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({ bar})}'           , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({ bar, ok})}'       , {accSco:['foo!bar!ok'] ,nameLoc: ['2;5!6;9!11;13']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({ba, quxx})}'       , {accSco:['foo!ba!quxx'] ,nameLoc: ['2;5!5;7!9;13']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({bar: qux})}'       , {accSco:['foo!qux'] ,nameLoc: ['2;5!10;13']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({bar: 0})[0]}'      , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'Many' , NaN , '${foo({bar: 0})[0].qux}'  , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'Many' , NaN , '${foo[bar]}'              , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'Many' , NaN , '${foo[0].bar[qux]}'       , {accSco:['foo!qux'] ,nameLoc: ['2;5!13;16']} , '' ] ,
  [{} , 'Many' , NaN , '${foo.bar}'               , {accSco:['foo'] ,nameLoc: ['2;5']} , '' ] ,
  [{} , 'Many' , NaN , '${foo.bar[0]}'            , {accSco:['foo'] ,nameLoc: ['2;5']} , '' ] ,
  [{} , 'Many' , NaN , '${foo[bar] | bar}'        , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,

  // Multiple Interpolations
  // , 'Type , LINE , 'CODE                       , {PARAMETERS
  [{focus:true} , 'Many' , NaN , 'foo ${bar}'                   , {accSco:['bar'] ,nameLoc: ['6;9']} , '' ] ,
];

describe('RegionParser.', () => {
  let shared = getEmptyShared();

  describe.only('File based.', () => {
    const filteredTestCaseMap = filterTestCaseMap(testCasesMapFileBased);

    Object.entries(filteredTestCaseMap).forEach(([testName, testCases]) => {
      testCases.forEach((testCase) => {
        const [, regionType, line, code, parameters, fileName] = testCase;

        // Actual suite
        describe(`${testName}.`, () => {
          describe(`${regionType}.`, () => {
            beforeEach(() => {
              if (fileName === '') return;

              givenImInTheProject('scoped-for-testing', shared);

              whenIParseTheFile(fileName, shared);

              andImOnTheLine(line, shared);
            });
            afterEach(() => {
              shared = getEmptyShared();
            });

            if (parameters.accSco != null && parameters.nameLoc != null) {
              it(code, () => {
                if (parameters.accSco == null) return;
                if (parameters.nameLoc == null) return;

                const rawExpectedAccessScopes = parameters.accSco;
                // rawExpectedAccessScopes; /*?*/
                const rawExpectedNameLocation = parameters.nameLoc;
                // rawExpectedNameLocation; /*?*/

                let startOffset = 0;
                if (code.startsWith('${')) {
                  startOffset += 2;
                }

                const targetParsed =
                  ParseExpressionUtil.getAllExpressionsOfKindV2(
                    code,
                    [ExpressionKind.AccessScope, ExpressionKind.CallScope],
                    { startOffset }
                  );
                targetParsed; /* ? */
                targetParsed.forEach((scope, scopeIndex) => {
                  // Name
                  const expectedAccessScopes =
                    rawExpectedAccessScopes[0].split(COLLECTION_SPLIT);
                  expect(scope.name).toBe(expectedAccessScopes[scopeIndex]);
                  // Location

                  const expectedNameLocation =
                    rawExpectedNameLocation[0].split(COLLECTION_SPLIT);
                  // expectedNameLocation; /* ? */
                  const [expectedStart, expectedEnd] =
                    expectedNameLocation[scopeIndex].split(GROUP_SPLIT);
                  // scope.nameLocation; /* ? */
                  const { start, end } = scope.nameLocation;
                  expect(start).toBe(Number(expectedStart));
                  expect(end).toBe(Number(expectedEnd));
                });

                if (rawExpectedAccessScopes == null) return;
                // const expectedAccessScopes =
                //   rawExpectedAccessScopes[regionIndex].split(COLLECTION_SPLIT);

                // expect(resultNames).toEqual(expectedAccessScopes);

                // if (rawExpectedNameLocation == null) return;
                // if (rawExpectedNameLocation.length === 0) return;

                // region.accessScopes?.forEach((scope, scopeIndex) => {
                //   const expectedNameLocation =
                //     rawExpectedNameLocation[regionIndex].split(
                //       COLLECTION_SPLIT
                //     );
                //   const [expectedStart, expectedEnd] =
                //     expectedNameLocation[scopeIndex].split(GROUP_SPLIT);
                //   const { start, end } = scope.nameLocation;

                //   expect(start).toEqual(Number(expectedStart));
                //   expect(end).toEqual(Number(expectedEnd));
                // });
              });
            }
          });
        });
      });
    });
  });
});

function myTests() {
  it.only('B', () => {
    // const input = 'Funding';
    // const input = 'Funding ${other}';
    const input = 'arr[qux] | hello';

    // const input = "<ul>Funding ${other} middle ${foo.bar ? `(${foo.bar.qux})` : ''} Max</ul>";
    // const result = parseExpression(`\${${input}}`, ExpressionType.Interpolation);
    // result; /*?*/
    const scopes = ParseExpressionUtil.getAllExpressionsOfKindV2(input, [
      ExpressionKind.AccessScope,
    ]);
    scopes.forEach((scope) => {
      const { start, end } = scope.nameLocation; /* ? */
      expect(start).toBe(0);
      expect(end).toBe(0);
    });
    // result.parts; /*?*/
    // result.expressions; /*?*/
    expect(false).toBeFalsy();
  });
}
