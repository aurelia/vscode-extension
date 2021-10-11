import { StepDefinitions } from 'jest-cucumber';

import { testError } from '../../common/errors/TestErrors';
import { getPathsFromFileNames } from '../../common/file-path-mocks';
import { myMockServer } from '../capabilities/new-common/project.step';

export const contentChangeSteps: StepDefinitions = ({ when, then }) => {
  when(/^I open the file "(.*)"$/, (fileName: string) => {
    const uri = myMockServer.getWorkspaceUri();
    testError.verifyFileInProject(uri, fileName);

    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrate');
    const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
    const [document] = myMockServer.textDocuments
      .mock(textDocumentPaths)
      .getAll();
    const aureliaServer = myMockServer.getAureliaServer();
    aureliaServer.onConnectionDidChangeContent({ document });
  });

  when(/^I change the file "(.*)"$/, (fileName: string) => {
    const uri = myMockServer.getWorkspaceUri();
    testError.verifyFileInProject(uri, fileName);

    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrate');
    const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
    const [document] = myMockServer.textDocuments
      .findAndChange(textDocumentPaths[0])
      .getAll();
    const aureliaServer = myMockServer.getAureliaServer();
    aureliaServer.onConnectionDidChangeContent({ document });
  });
};
