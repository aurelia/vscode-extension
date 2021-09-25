import * as path from 'path';
import { StepDefinitions } from 'jest-cucumber';
import {
  FileNameStepTable,
  getTableValues,
} from '../../../common/gherkin/gherkin-step-table';
import { CLI_GENERATED, MONOREPO } from '../../../common/file-path-mocks';
import { TestError, testError } from '../../../common/errors/TestErrors';
import { FixtureNames } from '../../../common/fixtures/get-fixture-dir';
import { myMockServer } from './detecting-on-init.spec';

export const hydrateSteps: StepDefinitions = ({ given, then }) => {
  given(
    'I open VSCode with the following files:',
    async (table: FileNameStepTable) => {
      const textDocumentPaths = getPathsFromTable(table);
      await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
    }
  );

  given(
    /^I open VSCode with the following file "(.*)"$/,
    async (fileName: string) => {
      const textDocumentPaths = getPathsFromFileNames([fileName]);
      await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
    }
  );

  then('the extension should hydrate the Aurelia project', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjects.getFirstAureliaProject();
    expect(aureliaProgram).toBeTruthy();
  });

  then('the extension should rehydrate', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    expect(AureliaProjects.hydrateAureliaProjects).toBeCalled();
  });

  then(/^the extension should not rehydrate$/, () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    expect(AureliaProjects.hydrateAureliaProjects).not.toBeCalled();
  });
};

async function givenIOpenVsCodeWithTheFollowingFiles(
  textDocumentPaths: string[]
) {
  const mockTextDocuments = myMockServer.textDocuments
    .mock(textDocumentPaths)
    .getAll();
  await myMockServer.getAureliaServer().onConnectionInitialized(
    {
      aureliaProject: {
        rootDirectory: myMockServer.getWorkspaceUri(),
      },
    },
    mockTextDocuments
  );
}

function getPathsFromTable(table: FileNameStepTable) {
  const fileNames = getTableValues(table);
  const paths = getPathsFromFileNames(fileNames);
  return paths;
}

/**
 * TODO: put somewhere else
 */
export function getPathsFromFileNames(fileNames: string[]) {
  return fileNames.map((fileName) => {
    const uri = myMockServer.getWorkspaceUri();
    const pathMock = getPathMocksFromUri(uri);
    const path = pathMock[fileName];

    if (path === undefined) {
      throw new TestError(`${fileName} does not exist in ${uri}`);
    }

    return path;
  });
}

function getPathMocksFromUri(uri: string): Record<string, string> {
  const basename = path.basename(uri) as FixtureNames;
  testError.verifyProjectName(basename);

  switch (basename) {
    case 'cli-generated': {
      return CLI_GENERATED;
    }
    case 'monorepo': {
      return MONOREPO;
    }
    default: {
      return {};
    }
  }
}
