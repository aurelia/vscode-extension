import { StepDefinitions } from 'jest-cucumber';
import { strictEqual } from 'assert';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { testError } from '../../../common/errors/TestErrors';
import { MockServer } from '../../../common/mock-server/mock-server';
import { testContainer } from '../../../jest-cucumber-setup.spec';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { Logger } from '../../../../server/src/common/logging/logger';

const logger = new Logger('[Test] Detecting');

export const MARK_START = 'MARK_START';
export const MARK_MIDDLE = 'MARK_MIDDLE';
export const MARK_END = 'MARK_END';

export let myMockServer: MockServer;
let _WORKSPACE_URI_CACHE = '';

describe.skip('single', () => {
  test('easy', (done) => {
    console.log('hi');
    // expect(true).toBeFalsy();
    done();
  });
});

export const commonExtensionSteps: StepDefinitions = ({ given, then }) => {
  given(/^the project is named "(.*)"$/, async (projectName: FixtureNames) => {
    /* prettier-ignore */ logger.log('/^the project is named "(.*)"$/', { logPerf: true, reset: true, });

    testError.verifyProjectName(projectName);

    const workspaceRootUri = getFixtureUri(projectName);
    const useCached = workspaceRootUri !== _WORKSPACE_URI_CACHE;
    if (useCached) {
      // if (true) {
      myMockServer = new MockServer(testContainer, workspaceRootUri, {
        aureliaProject: {
          rootDirectory: UriUtils.toPath(workspaceRootUri),
        },
      });
      myMockServer.setWorkspaceUri(workspaceRootUri);
    }

    _WORKSPACE_URI_CACHE = workspaceRootUri;
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
