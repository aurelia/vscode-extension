import {
  ExpressionKind,
  ExpressionType,
} from '../../../server/src/common/@aurelia-runtime-patch/src';
import { ParseExpressionUtil } from '../../../server/src/common/parseExpression/ParseExpressionUtil';
import { ViewRegionType } from '../../../server/src/core/regions/ViewRegions';
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
  // , 'Type , LINE , 'CODE                                    , {PARAMETERS
  [{} , 'Attribute' , NaN , 'foo'                              , {accSco:['foo'] ,nameLoc: ['0;3']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo(bar)'                         , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo(bar())'                       , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo(bar(qux))'                    , {accSco:['foo!bar!qux'] ,nameLoc: ['0;3!4;7!8;11']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo(bar, qux(zed))'               , {accSco:['foo!bar!qux!zed'] ,nameLoc: ['0;3!4;7!9;12!13;16']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo("bar", qux(zed))'             , {accSco:['foo!qux!zed'] ,nameLoc: ['0;3!11;14!15;18']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo("bar", qux)'                  , {accSco:['foo!qux'] ,nameLoc: ['0;3!11;14']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo(bar, qux)'                    , {accSco:['foo!bar!qux'] ,nameLoc: ['0;3!4;7!9;12']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({bar})'                       , {accSco:['foo!bar'] ,nameLoc: ['0;3!5;8']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({ bar})'                      , {accSco:['foo!bar'] ,nameLoc: ['0;3!6;9']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({ bar, ok})'                  , {accSco:['foo!bar!ok'] ,nameLoc: ['0;3!6;9!11;13']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({ba, quxx})'                  , {accSco:['foo!ba!quxx'] ,nameLoc: ['0;3!5;7!9;13']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({bar: qux})'                  , {accSco:['foo!qux'] ,nameLoc: ['0;3!10;13']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({bar: 0})[0]'                 , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo({bar: 0})[0].qux'             , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo[bar]'                         , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo[0].bar[qux]'                  , {accSco:['foo!qux'] ,nameLoc: ['0;3!11;14']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo.bar'                          , {accSco:['foo'] ,nameLoc: ['0;3']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo.bar(qux)'                     , {accSco:['foo!qux'] ,nameLoc: ['0;3!8;11']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo.bar[0]'                       , {accSco:['foo'] ,nameLoc: ['0;3']} , '' ] ,
  [{} , 'Attribute' , NaN , 'foo[bar] | bar'                   , {accSco:['foo!bar'] ,nameLoc: ['0;3!4;7']} , '' ] ,

  // Single Interpolation
  // , 'Type , LINE , 'CODE                                    , {PARAMETERS
  [{} , 'TextInterpolation' , NaN , '${foo}'                   , {accSco:['foo'] ,nameLoc: ['2;5']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo(bar)}'              , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo(bar())}'            , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo(bar(qux))}'         , {accSco:['foo!bar!qux'] ,nameLoc: ['2;5!6;9!10;13']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo(bar, qux(zed))}'    , {accSco:['foo!bar!qux!zed'] ,nameLoc: ['2;5!6;9!11;14!15;18']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo("bar", qux(zed))}'  , {accSco:['foo!qux!zed'] ,nameLoc: ['2;5!13;16!17;20']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo("bar", qux)}'       , {accSco:['foo!qux'] ,nameLoc: ['2;5!13;16']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo(bar, qux)}'         , {accSco:['foo!bar!qux'] ,nameLoc: ['2;5!6;9!11;14']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({bar})}'            , {accSco:['foo!bar'] ,nameLoc: ['2;5!7;10']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({ bar})}'           , {accSco:['foo!bar'] ,nameLoc: ['2;5!8;11']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({ bar, ok})}'       , {accSco:['foo!bar!ok'] ,nameLoc: ['2;5!8;11!13;15']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({ba, quxx})}'       , {accSco:['foo!ba!quxx'] ,nameLoc: ['2;5!7;9!11;15']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({bar: qux})}'       , {accSco:['foo!qux'] ,nameLoc: ['2;5!12;15']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({bar: 0})[0]}'      , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo({bar: 0})[0].qux}'  , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo[bar]}'              , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo[0].bar[qux]}'       , {accSco:['foo!qux'] ,nameLoc: ['2;5!13;16']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo.bar}'               , {accSco:['foo'] ,nameLoc: ['2;5']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo.bar(qux)}'          , {accSco:['foo!qux'] ,nameLoc: ['2;5!10;13']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo.bar[0]}'            , {accSco:['foo'] ,nameLoc: ['2;5']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo[bar] | bar}'        , {accSco:['foo!bar'] ,nameLoc: ['2;5!6;9']} , '' ] ,

  // Multiple Interpolations
  // , 'Type , LINE , 'CODE                                    , {PARAMETERS
  [{} , 'TextInterpolation' , NaN , 'foo${bar}'                , {accSco:['bar'] ,nameLoc: ['5;8']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , 'foo ${bar} qux'           , {accSco:['bar'] ,nameLoc: ['6;9']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo} ${bar}'            , {accSco:['foo!bar'] ,nameLoc: ['2;5!9;12']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo} bar ${qux}'        , {accSco:['foo!qux'] ,nameLoc: ['2;5!13;16']} , '' ] ,
  [{} , 'TextInterpolation' , NaN , '${foo} ${bar} qux'        , {accSco:['foo!bar'] ,nameLoc: ['2;5!9;12']} , '' ] ,

  // Nested Interpolations
  // , 'Type , LINE , 'CODE                                    , {PARAMETERS
  [{} , 'TextInterpolation' , NaN , '${foo ? `${bar}` : ""}'   , {accSco:['foo!bar'] ,nameLoc: ['2;5!11;14']} , '' ] ,
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
                let expressionType = ExpressionType.None;
                if (regionType === ViewRegionType.TextInterpolation) {
                  // startOffset += 2;
                  expressionType = ExpressionType.Interpolation;
                }

                code /* ? */
                const targetParsed =
                  ParseExpressionUtil.getAllExpressionsOfKindV2(
                    code,
                    [ExpressionKind.AccessScope, ExpressionKind.CallScope],
                    { startOffset, expressionType }
                  );
                targetParsed; /* ? */
                // JSON.stringify(targetParsed, null, 4) /* ? */
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
                // expect(true).toBeFalsy();
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
