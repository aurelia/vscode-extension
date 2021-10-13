import { Logger } from '../../../../server/src/common/logging/logger';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { Container } from '../../../../server/src/core/container';
import { testError } from '../../../common/errors/TestErrors';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { MockServer } from '../../../common/mock-server/mock-server';

const testContainer = new Container();
const logger = new Logger('Project steps');

export let myMockServer: MockServer;
let _WORKSPACE_URI_CACHE = '';

export function theProjectIsNamed(projectName: FixtureNames) {
  logger.log('/^the project is named "(.*)"$/', { reset: true });
  // /* prettier-ignore */ logger.log('/^the project is named "(.*)"$/', { logPerf: true, reset: true, });
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
    // myMockServer.setWorkspaceUri(workspaceRootUri);
  }

  _WORKSPACE_URI_CACHE = workspaceRootUri;
}

export async function givenIOpenVsCodeWithTheFollowingFiles(
  textDocumentPaths: string[]
) {
  const mockTextDocuments = myMockServer.textDocuments
    .mock(textDocumentPaths)
    .setActive(textDocumentPaths)
    .getAll();
  await myMockServer.getAureliaServer().onConnectionInitialized(
    {
      aureliaProject: {
        rootDirectory: myMockServer.getWorkspaceUri(),
      },
    },
    mockTextDocuments
  );
}
