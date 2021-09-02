import { Feature } from 'fermenter';
import { sum } from 'lodash';
import { strictEqual } from 'assert';
import * as path from 'path';
import { Container } from 'aurelia-dependency-injection';
import { findProjectRoot } from '../../common/find-project-root';
import { MockServer } from '../../common/mock-server';

const COMPONENT_NAME = 'minimal-component';
// const COMPONENT_NAME = 'my-compo';
const COMPONENT_VIEW_FILE_NAME = `${COMPONENT_NAME}.html`;
const COMPONENT_VIEW_PATH = `./src/${COMPONENT_NAME}/${COMPONENT_VIEW_FILE_NAME}`;

const testsDir = findProjectRoot(); /*?*/
const monorepoFixtureDir = path.resolve(
  testsDir,
  `tests/testFixture/cli-generated`
);
const workspaceRootUri = `file:/${monorepoFixtureDir}`; /*?*/

Feature('../on-initialized.feature', ({ Scenario }) => {
  Scenario('Detecting simple CLI generated project').Given(
    'I have a CLI genrated Aurelia project',
    async () => {
      const mockServer = new MockServer(new Container(), workspaceRootUri);
      mockServer.getAureliaServer().onConnectionInitialized({
        aureliaProject: {
          rootDirectory: workspaceRootUri,
        },
      });

      const testAureliaExtension = mockServer.getContainerDirectly()
        .AureliaProjectFiles;
      await testAureliaExtension.hydrateAureliaProjectList([]);

      const auProjectList = testAureliaExtension.getAureliaProjects();
      strictEqual(auProjectList.length, 1);
      strictEqual(auProjectList[0].aureliaProgram, null);
    }
  );
});
