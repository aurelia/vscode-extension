import { StepDefinitions } from 'jest-cucumber';

import { testError } from '../../common/errors/TestErrors';
import { getPathsFromFileNames } from '../../common/file-path-mocks';
import { myMockServer } from '../capabilities/new-common/project.step';

export const contentChangeSteps: StepDefinitions = ({ when }) => {
  when(/^I open the file "(.*)"$/, async (fileName: string) => {
    const uri = myMockServer.getWorkspaceUri();
    testError.verifyFileInProject(uri, fileName);

    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrate');
    const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
    const document = myMockServer.textDocuments
      .mock(textDocumentPaths)
      .getActive();
    const aureliaServer = myMockServer.getAureliaServer();

    await aureliaServer.onConnectionDidChangeContent({ document });
  });

  when(/^I change the file "(.*)"$/, async (fileName: string) => {
    const uri = myMockServer.getWorkspaceUri();
    testError.verifyFileInProject(uri, fileName);

    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrate');
    const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
    const [document] = myMockServer.textDocuments
      .findAndChange(textDocumentPaths[0])
      .getAll();
    const aureliaServer = myMockServer.getAureliaServer();
    await aureliaServer.onConnectionDidChangeContent({ document });
  });
};
