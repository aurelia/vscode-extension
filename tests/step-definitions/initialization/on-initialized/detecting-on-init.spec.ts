import { strictEqual } from 'assert';

import { StepDefinitions } from 'jest-cucumber';

import { FixtureNames } from '../../../common/fixtures/get-fixture-dir';
import { MockServer } from '../../../common/mock-server/mock-server';
import { theProjectIsNamed } from '../../capabilities/new-common/project.step';

export let myMockServer: MockServer;

export const commonExtensionSteps: StepDefinitions = ({ given, then }) => {
  given(/^the project is named "(.*)"$/, async (projectName: FixtureNames) => {
    /* prettier-ignore */ theProjectIsNamed(projectName);
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
    // [PERF][TODO]: For perf, this should be active
    // strictEqual(auProjects[0].aureliaProgram, null);
  });

  then('the extension should detect all Aurelia projects', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getProjects();
    strictEqual(auProjects.length >= 2, true);
  });
};
