import { RegionParser } from '../../../server/src/aot/parser/regions/RegionParser';
import {
  ViewRegionType,
  AbstractRegion,
} from '../../../server/src/aot/parser/regions/ViewRegions';
import { getPathsFromFileNames } from '../../common/file-path-mocks';
import {
  FixtureNames,
  getFixtureUri,
} from '../../common/fixtures/get-fixture-dir';
import { MockTextDocuments } from '../../common/mock-server/text-documents';

interface TestCaseFileBasedParameters {
  accSco?: string[];
  nameLoc?: string[];
  /** [start;end] */
  off?: string;
  regVal?: string;
}

interface TestCaseOptions {
  focus?: boolean;
}

type TestRegionType = keyof typeof ViewRegionType | 'ATag' | 'Many';

type TestCaseFileBased = [
  TestCaseOptions,
  string /* Code */,
  TestCaseFileBasedParameters,
  TestRegionType,
  number /* Line */,
  string /* Filename */
];
export interface TestCasesMapFileBased {
  [description: string]: TestCaseFileBased[];
}

interface Shared {
  workspaceRootUri: string;
  parsedRegions: AbstractRegion[];
  line: number;
}

export const COLLECTION_SPLIT = '!';
export const GROUP_SPLIT = ';';

export function getEmptyShared() {
  const parsedRegions: AbstractRegion[] = [];
  const shared: Shared = {
    workspaceRootUri: '',
    parsedRegions,
    line: NaN,
  };
  return shared;
}

export function givenImInTheProject(projectName: FixtureNames, shared: Shared) {
  shared.workspaceRootUri = getFixtureUri(projectName);
}

export function whenIParseTheFile(fileName: string, shared: Shared) {
  const textDocumentPaths = getPathsFromFileNames(shared.workspaceRootUri, [
    fileName,
  ]);
  const textDocuments = new MockTextDocuments(shared.workspaceRootUri);
  const textDocument = textDocuments
    .mock(textDocumentPaths)
    .setActive(textDocumentPaths)
    .getActive();

  // const parsedRegions = await parseDocumentRegions<ViewRegionInfo[]>(
  const parsedRegions = RegionParser.parse(textDocument, [
    // @ts-ignore
    {
      componentName: 'custom-element',
      viewFilePath: 'custom-element.html',
      classMembers: [
        // @ts-ignore
        { name: 'foo', isBindable: true },
        // @ts-ignore
        { name: 'bar', isBindable: true },
        // @ts-ignore
        { name: 'qux' },
        // @ts-ignore
        { name: 'useFoo' },
      ],
    },
  ]);

  shared.parsedRegions = parsedRegions;
}

export function whenILintTheFile(fileName: string, shared: Shared) {
  const textDocumentPaths = getPathsFromFileNames(shared.workspaceRootUri, [
    fileName,
  ]);
  const textDocuments = new MockTextDocuments(shared.workspaceRootUri);
  const textDocument = textDocuments
    .mock(textDocumentPaths)
    .setActive(textDocumentPaths)
    .getActive();

  // const parsedRegions = await parseDocumentRegions<ViewRegionInfo[]>(
  const componentList = [
    {
      componentName: 'view-diagnostics',
      viewFilePath: 'view-diagnostics.html',
      classMembers: [
        // @ts-ignore
        { name: 'fooBar', isBindable: true },
      ],
    },
  ];
  const parsedRegions = RegionParser.parse(
    textDocument,
    // @ts-ignore
    componentList
  );

  const linted = RegionParser.lint(
    parsedRegions,
    // @ts-ignore
    componentList
  );

  linted;/* ? */

  shared.parsedRegions = parsedRegions;
}

export function andImOnTheLine(line: number, shared: Shared) {
  shared.line = line;
}

export function filterTestCaseMap(testCasesMap: TestCasesMapFileBased) {
  const finalTestCasesMap: TestCasesMapFileBased = {};

  Object.entries(testCasesMap).forEach(([testName, testCases]) => {
    testCases.forEach((testCase) => {
      if (testCase[0].focus !== true) return;

      if (finalTestCasesMap[testName] == null) {
        finalTestCasesMap[testName] = [];
      }
      finalTestCasesMap[testName].push(testCase);
    });
  });

  if (Object.keys(finalTestCasesMap).length === 0) {
    return testCasesMap;
  }

  return finalTestCasesMap;
}
