import { StepDefinitions } from 'jest-cucumber';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';

export const contentChangeSteps: StepDefinitions = ({ when, then }) => {
  when(/^I open the file "(.*)"$/, (fileName: string) => {
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
  });
};
