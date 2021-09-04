import * as path from 'path';
import { StepDefinitions } from 'jest-cucumber';
import {
  FileNameStepTable,
  getTableValues,
} from '../../../common/gherkin/gherkin-step-table';
import { CLI_GENERATED, MONOREPO } from '../../../common/file-path-mocks';
import { testError } from '../../../common/errors/TestErrors';
import { FixtureNames } from '../../../common/fixtures/get-fixture-dir';
import { myMockServer } from './detecting-on-init.spec';

export const hydrateSteps: StepDefinitions = ({ given, then }) => {
  given(
    'I open VSCode with the following files:',
    async (table: FileNameStepTable) => {
      const textDocumentPaths = getPathsFromTable(table);
      const mockTextDocuments = myMockServer
        .mockTextDocuments(textDocumentPaths)
        .getTextDocuments();
      await myMockServer.getAureliaServer().onConnectionInitialized(
        {
          aureliaProject: {
            rootDirectory: myMockServer.getWorkspaceUri(),
          },
        },
        mockTextDocuments
      );
    }
  );

  then('the extension should hydrate the Aurelia project', () => {
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjectFiles.getAureliaProjects()[0];
    expect(aureliaProgram).toBeTruthy();
  });
};

function getPathsFromTable(table: FileNameStepTable) {
  const fileNames = getTableValues(table);
  const paths = getPathsFromFileNames(fileNames);
  return paths;
}

function getPathsFromFileNames(fileNames: string[]) {
  return fileNames.map((fileName) => {
    const uri = myMockServer.getWorkspaceUri();
    const pathMock = getPathMocksFromUri(uri);
    const path = pathMock[fileName];

    if (path === undefined) {
      testError.log(`${fileName} does not exist in ${uri}`);
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
