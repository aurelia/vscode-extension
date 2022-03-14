
import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionParser } from '../../../server/src/aot/parser/regions/RegionParser';
import {
  RepeatForRegion,
  ViewRegionSubType,
  ViewRegionType,
} from '../../../server/src/aot/parser/regions/ViewRegions';
import { AureliaView } from '../../../server/src/common/constants';
import { RegionService } from '../../../server/src/common/services/RegionService';
import {
  TestCasesMapFileBased,
  getEmptyShared,
  filterTestCaseMap,
  givenImInTheProject,
  whenIParseTheFile,
  andImOnTheLine,
  COLLECTION_SPLIT,
  GROUP_SPLIT,
  whenILintTheFile,
} from '../common/testTemplate';

const testCasesMapFileBased: TestCasesMapFileBased = {};

/* prettier-ignore */
testCasesMapFileBased['Offsets'] = [
  //   , CODE                                          , PARAMETERS                        , Type                      , LINE  , FILE
  [{}  , '  testOkay.from-view="foo"'                , {regVal:'barBaz' ,off:'45;51'}    , 'Attribute'               , 1     , 'view-diagnostics.html' ] ,
  // [{}  , '<div id="${foo}"></div>'                     , {regVal:'foo' ,off:'18;21'}       , 'AttributeInterpolation'  , 1     , 'custom-element.html' ] ,
  // [{}  , ''                                            , {}                                , 'CustomElement'           , NaN   , 'other-custom-element-user.html' ] ,
  // [{}  , ''                                            , {}                                , 'Import'                  , NaN   , 'other-custom-element-user.html' ] ,
  // [{}  , '<div repeat.for="fooElement of foo"></div>'  , {regVal:'foo' ,off:'91;94'}       , 'RepeatFor'               , 3     , 'custom-element.html' ] ,
  // [{}  , '${foo}'                                      , {regVal:'foo' ,off:'2;6' }        , 'TextInterpolation'       , 0     , 'custom-element.html' ] ,
];

/* prettier-ignore */
// testCasesMapFileBased['Access scopes'] = [
//    //     , CODE                                                        , PARAMETERS                                                                         , Type                      , LINE  , FILE
//    [{}    , '<p id.bind="foo"></p>'                                     , {accSco:['foo'] ,nameLoc:['12;15'] }                                               , 'Attribute'               , NaN   , '' ] ,
//    [{}    , '<p repeat.for="person of people"></p>'                     , {accSco:['people']}                                                                , 'Attribute'               , NaN   , ''] ,
//    [{}    , '<p repeat.for="p of people | foo:bar & qux:\'zed\'"></p>'  , {accSco:['people;bar']}                                                            , 'Many'                    , NaN   , ''] ,

//    // //  , Html-only Custom Elements
//    [{}    , '<template bindable="foo"></template>'                      , {accSco:['foo'] ,nameLoc:['20;23'] }                                               , 'Attribute'               , NaN   , '' ] ,

//    // //  , Nested
//    [{}    , '<p>a ${zzz} mid ${foo ? `(${foo.bar})` : ""} Max</p>'      , {accSco:['zzz','foo!foo'] ,nameLoc:['7;10','18;21!28;31'] }                        , 'Attribute'               , NaN   , '' ] ,

//    [{}    , '<p>${foo}<</p>'                                            , {accSco:['foo'] ,nameLoc:['5;8'] }                                                 , 'TextInterpolation'       , NaN   , '' ] ,

//    // //  , File based
//    // //  , CODE                                                        , PARAMETERS                                                                         , Type                      , LINE  , FILE
//    [{}    , '<div id="${foo}"></div>'                                   , {accSco:['foo'] ,nameLoc: ['18;21']}                                               , 'AttributeInterpolation'  , 1     , 'custom-element.html'],
//    [{}    , '<div id.bind="barBaz"></div>'                              , {accSco:['barBaz'] ,nameLoc: ['45;51']}                                               , 'Attribute'               , 2     , 'custom-element.html'],
//    [{focus:true}    , '<div repeat.for="fooElement of foo"></div>'      , {accSco:['foo'] ,nameLoc: ['91;94']}                                               , 'Attribute'               , 3     , 'custom-element.html'],
//    [{}    , '<span id.bind="qux.attr">${qux.interpol}</span>'           , {accSco:['qux','qux'] ,nameLoc: ['118;121','130;133']}                             , 'Many'                    , 4     , 'custom-element.html'],
//    [{}    , '<p class="${useFoo(qux)}">${arr[qux] |hello}</p>'          , {accSco:['useFoo!qux','arr!qux'] ,nameLoc: ['163;169!170;173','179;182!183;186']}  , 'Many'                    , 5     , 'custom-element.html'],
// ];

/* prettier-ignore */
// testCasesMapFileBased['No parse result'] = [
//   //  , CODE               , PARAMETERS   , Type    , LINE  , FILE
//   [{} , '<a href=""></a>'  , {}           , 'ATag'  , 0     , '' ] ,
// ];

describe.only('RegionParser#lint.', () => {
  let shared = getEmptyShared();
  const filteredTestCaseMap = filterTestCaseMap(testCasesMapFileBased);

  Object.entries(filteredTestCaseMap).forEach(([testName, testCases]) => {
    testCases.forEach((testCase) => {
      const [, code, parameters, regionType, line, fileName] = testCase;

      // Actual suite
      describe(`${testName}.`, () => {
        describe(`${regionType}.`, () => {
          beforeEach(() => {
            if (fileName === '') return;

            givenImInTheProject('scoped-for-testing', shared);

            whenILintTheFile(fileName, shared);

            andImOnTheLine(line, shared);
          });
          afterEach(() => {
            shared = getEmptyShared();
          });

          it('hi', () => {
            console.log('hi');
            expect(true).toBeFalsy();
          });
        });
      });
    });
  });
});
