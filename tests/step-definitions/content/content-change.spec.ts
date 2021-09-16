import { StepDefinitions } from 'jest-cucumber';
import { testError } from '../../common/errors/TestErrors';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';
import { getPathsFromFileNames } from '../initialization/on-initialized/hydrate-on-init.spec';

export const contentChangeSteps: StepDefinitions = ({ when, then }) => {
  when(/^I open the file "(.*)"$/, (fileName: string) => {
    testError.verifyFileInProject(fileName)

    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjectFiles, 'hydrateAureliaProjectList');
    const aureliaServer = myMockServer.getAureliaServer();
    const [document] = myMockServer
      .mockTextDocuments([fileName])
      .getTextDocuments();
    aureliaServer.onConnectionDidChangeContent({ document });
  });

  then(/^the extension should not rehydrate$/, () => {
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    expect(AureliaProjectFiles.hydrateAureliaProjectList).not.toBeCalled();
    expect(AureliaProjectFiles.hydrateAureliaProjectList).toBeCalled();
  });

  when(/^I change the file "(.*)"$/, (fileName: string) => {
    testError.verifyFileInProject(fileName)

    // 1. get document in save
    // 2. check aginst new version
    // 3. rehydrate

    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjectFiles, 'hydrateAureliaProjectList');
    const aureliaServer = myMockServer.getAureliaServer();
    const [document] = myMockServer
      .mockTextDocuments([fileName])
      .getTextDocuments();
    aureliaServer.onConnectionDidChangeContent({ document });
  });

};
