import { StepDefinitions } from 'jest-cucumber';

import { testError } from '../../common/errors/TestErrors';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';
import { getPathsFromFileNames } from '../initialization/on-initialized/hydrate-on-init.spec';

export const contentChangeSteps: StepDefinitions = ({ when, then }) => {
  when(/^I open the file "(.*)"$/, (fileName: string) => {
    testError.verifyFileInProject(fileName);

    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrateAureliaProjects');
    const textDocumentPaths = getPathsFromFileNames([fileName]);
    const [document] = myMockServer.textDocuments
      .mock(textDocumentPaths)
      .getAll();
    const aureliaServer = myMockServer.getAureliaServer();
    aureliaServer.onConnectionDidChangeContent({ document });
  });

  when(/^I change the file "(.*)"$/, (fileName: string) => {
    testError.verifyFileInProject(fileName);

    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrateAureliaProjects');
    const textDocumentPaths = getPathsFromFileNames([fileName]);
    const [document] = myMockServer.textDocuments
      .findAndChange(textDocumentPaths[0])
      .getAll();
    const aureliaServer = myMockServer.getAureliaServer();
    aureliaServer.onConnectionDidChangeContent({ document });
  });
};
