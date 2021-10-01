import { StepDefinitions } from 'jest-cucumber';

import { Logger } from '../../../../server/src/common/logging/logger';
import { getPathsFromFileNames } from '../../../common/file-path-mocks';
import {
  FileNameStepTable,
  getTableValues,
} from '../../../common/gherkin/gherkin-step-table';
import { givenIOpenVsCodeWithTheFollowingFiles } from '../../capabilities/new-common/project.step';
import { myMockServer } from './detecting-on-init.spec';

const logger = new Logger('[Test] Hydrate on init');

export const hydrateSteps: StepDefinitions = ({ given, then, and }) => {
  given(
    'I open VSCode with the following files:',
    async (table: FileNameStepTable) => {
      /* prettier-ignore */ logger.log('I open VSCode with the following files:');
      const uri = myMockServer.getWorkspaceUri();
      const textDocumentPaths = getPathsFromTable(uri, table);
      await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
    }
  );

  and(
    /^I open VSCode with the following file "(.*)"$/,
    async (fileName: string) => {
      /* prettier-ignore */ logger.log('^I open VSCode with the following file "(.*)"$');
      const uri = myMockServer.getWorkspaceUri();
      const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
      await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
    }
  );

  then('the extension should hydrate the Aurelia project', () => {
    /* prettier-ignore */ logger.log('the extension should hydrate the Aurelia project');
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjects.getFirstAureliaProject();
    expect(aureliaProgram).toBeTruthy();
  });

  then('the extension should rehydrate', () => {
    /* prettier-ignore */ logger.log('the extension should rehydrate');
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    expect(AureliaProjects.hydrateAureliaProjects).toBeCalled();
  });

  then(/^the extension should not rehydrate$/, () => {
    /* prettier-ignore */ logger.log('/^the extension should not rehydrate$/');
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    expect(AureliaProjects.hydrateAureliaProjects).not.toBeCalled();
  });
};

function getPathsFromTable(uri: string, table: FileNameStepTable) {
  const fileNames = getTableValues(table);
  const paths = getPathsFromFileNames(uri, fileNames);
  return paths;
}
