import { StepDefinitions } from 'jest-cucumber';
import { strictEqual } from 'assert';
import * as path from 'path';
import { Container } from 'aurelia-dependency-injection';
import { findProjectRoot } from '../../../common/find-project-root';
import { MockServer } from '../../../common/mock-server';

const COMPONENT_NAME = 'minimal-component';
const COMPONENT_VIEW_FILE_NAME = `${COMPONENT_NAME}.html`;
const COMPONENT_VIEW_PATH = `./src/${COMPONENT_NAME}/${COMPONENT_VIEW_FILE_NAME}`;

const testsDir = findProjectRoot(); /*?*/
const monorepoFixtureDir = path.resolve(
  testsDir,
  `tests/testFixture/cli-generated`
);
const workspaceRootUri = `file:/${monorepoFixtureDir}`; /*?*/

export const cliGenerateSteps: StepDefinitions = ({ given, then }) => {
  let testAureliaProjectFiles;

  given('I have a CLI genrated Aurelia project', async () => {
    const mockServer = new MockServer(new Container(), workspaceRootUri);
    mockServer.getAureliaServer().onConnectionInitialized({
      aureliaProject: {
        rootDirectory: workspaceRootUri,
      },
    });

    testAureliaProjectFiles = mockServer.getContainerDirectly()
      .AureliaProjectFiles;
  });

  then('the extension should recognize it', () => {
    const auProjectList = testAureliaProjectFiles.getAureliaProjects();
    strictEqual(auProjectList.length, 1);
    strictEqual(auProjectList[0].aureliaProgram, null);
  });
};
