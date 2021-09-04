import { StepDefinitions } from 'jest-cucumber';
import { strictEqual } from 'assert';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { testError } from '../../../common/errors/TestErrors';
import { MockServer } from '../../../common/mock-server';
import { testContainer } from '../../../jest-cucumber-setup.spec';

export let myMockServer = new MockServer(testContainer);

export const commonExtensionSteps: StepDefinitions = ({ and, then }) => {
  and(/^the project is named "(.*)"$/, async (projectName: FixtureNames) => {
    myMockServer = new MockServer(testContainer);
    testError.verifyProjectName(projectName);

    const workspaceRootUri = getFixtureUri(projectName);
    myMockServer.setWorkspaceUri(workspaceRootUri);
  });

  then('the extension should not activate', () => {
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const auProjectList = AureliaProjectFiles.getAureliaProjects();
    strictEqual(auProjectList.length, 0);
  });
};

export const cliGenerateSteps: StepDefinitions = ({ given, then }) => {
  given(/^I open VSCode with no active files$/, async () => {
    const mockTextDocuments = myMockServer
      .mockTextDocuments()
      .getTextDocuments();
    await myMockServer.getAureliaServer().onConnectionInitialized(
      {
        aureliaProject: {
          rootDirectory: myMockServer.getWorkspaceUri(),
        },
      },
      mockTextDocuments
    );
  });

  then('the extension should detect the Aurelia project', () => {
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const auProjectList = AureliaProjectFiles.getAureliaProjects();
    strictEqual(auProjectList.length, 1);
    strictEqual(auProjectList[0].aureliaProgram, null);
  });

  then('the extension should detect all Aurelia projects', () => {
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const auProjectList = AureliaProjectFiles.getAureliaProjects();
    strictEqual(auProjectList.length >= 2, true);
  });
};
