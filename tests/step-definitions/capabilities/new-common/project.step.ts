import { Logger } from '../../../../server/src/common/logging/logger';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { ExtensionSettings } from '../../../../server/src/configuration/DocumentSettings';
import { Container } from '../../../../server/src/core/container';
import { testError } from '../../../common/errors/TestErrors';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { MockServer } from '../../../common/mock-server/mock-server';

const logger = new Logger('Project steps');

// eslint-disable-next-line import/no-mutable-exports
export let myMockServer: MockServer;
let _WORKSPACE_URI_CACHE = '';

export function theProjectIsNamed(projectName: FixtureNames): void {
  logger.log('/^the project is named "(.*)"$/', { reset: true, env: 'test' });
  // /* prettier-ignore */ logger.log('/^the project is named "(.*)"$/', { logPerf: true, reset: true, });
  testError.verifyProjectName(projectName);

  const workspaceRootUri = getFixtureUri(projectName);
  const useCached = workspaceRootUri !== _WORKSPACE_URI_CACHE;
  // if (useCached) {
  if (true) {
    const testContainer = new Container();
    myMockServer = new MockServer(testContainer, workspaceRootUri, {
      aureliaProject: {
        rootDirectory: UriUtils.toSysPath(workspaceRootUri),
      },
    });
    // myMockServer.setWorkspaceUri(workspaceRootUri);
  }

  _WORKSPACE_URI_CACHE = workspaceRootUri;
}

export async function givenIOpenVsCodeWithTheFollowingFiles(
  textDocumentPaths: string[] = [],
  extensionSettings?: ExtensionSettings
): Promise<void> {
  myMockServer.textDocuments
    .mock(textDocumentPaths)
    .setActive(textDocumentPaths)
    .getAll();
  await myMockServer.getAureliaServer().onConnectionInitialized({
    aureliaProject: {
      rootDirectory: myMockServer.getWorkspaceUri(),
      ...extensionSettings?.aureliaProject,
    },
  });
}
