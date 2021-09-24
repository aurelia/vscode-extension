import { StepDefinitions } from 'jest-cucumber';
import { strictEqual } from 'assert';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { testError } from '../../../common/errors/TestErrors';
import { MockServer } from '../../../common/mock-server/mock-server';
import { testContainer } from '../../../jest-cucumber-setup.spec';

export let myMockServer: MockServer;

export const commonExtensionSteps: StepDefinitions = ({ and, then }) => {
  and(/^the project is named "(.*)"$/, async (projectName: FixtureNames) => {
    const workspaceRootUri = getFixtureUri(projectName);
    myMockServer = new MockServer(testContainer, workspaceRootUri, {
      aureliaProject: {
        rootDirectory: workspaceRootUri,
      },
    });
    testError.verifyProjectName(projectName);

    myMockServer.setWorkspaceUri(workspaceRootUri);
  });

  then('the extension should not activate', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getProjects();
    strictEqual(auProjects.length, 0);
  });
};

export const cliGenerateSteps: StepDefinitions = ({ given, then }) => {
  given(/^I open VSCode with no active files$/, async () => {
    const mockTextDocuments = myMockServer.textDocuments.mock().getAll();
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
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getProjects();
    strictEqual(auProjects.length, 1);
    strictEqual(auProjects[0].aureliaProgram, null);
  });

  then('the extension should detect all Aurelia projects', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getProjects();
    strictEqual(auProjects.length >= 2, true);
  });
};
