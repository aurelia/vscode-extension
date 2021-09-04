import { StepDefinitions } from 'jest-cucumber';
import { strictEqual } from 'assert';
import { Container } from 'aurelia-dependency-injection';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { MockServer } from '../../../common/mock-server';
import {
  FixtureNames,
  getFixtureDir,
} from '../../../common/fixtures/get-fixture-dir';
import { AureliaProjectFiles } from '../../../../server/src/common/AureliaProjectFiles';
import { testError } from '../../../common/errors/TestErrors';

let testAureliaProjectFiles: AureliaProjectFiles;
let activeDocuments: TextDocument[] = [];

export const nonAureliaProjectSteps: StepDefinitions = ({ and, then }) => {
  and(/^the project is named "(.*)"$/, (projectName: FixtureNames) => {
    const workspaceRootUri = getFixtureDir(projectName);
    const mockServer = new MockServer(new Container(), workspaceRootUri);
    mockServer.getAureliaServer().onConnectionInitialized(
      {
        aureliaProject: {
          rootDirectory: workspaceRootUri,
        },
      },
      activeDocuments
    );

    testAureliaProjectFiles = mockServer.getContainerDirectly()
      .AureliaProjectFiles;
  });

  then('the extension should not activate', () => {
    const auProjectList = testAureliaProjectFiles.getAureliaProjects();
    strictEqual(auProjectList.length, 0);
  });
};

export const cliGenerateSteps: StepDefinitions = ({ given, then }) => {
  given(/^I open VSCode with no active files$/, () => {
    activeDocuments = [];
    expect(activeDocuments.length).toBe(0);
  });

  given(
    /^I have a CLI generated Aurelia project structure "(.*)"$/,
    async (projectName: FixtureNames) => {
      testError.verifyProjectName(projectName);

      const workspaceRootUri = getFixtureDir(projectName);
      const mockServer = new MockServer(new Container(), workspaceRootUri);
      mockServer.getAureliaServer().onConnectionInitialized(
        {
          aureliaProject: {
            rootDirectory: workspaceRootUri,
          },
        },
        activeDocuments
      );

      testAureliaProjectFiles = mockServer.getContainerDirectly()
        .AureliaProjectFiles;
    }
  );

  then('the extension should recognize the Aurelia project', () => {
    const auProjectList = testAureliaProjectFiles.getAureliaProjects();
    strictEqual(auProjectList.length, 1);
    strictEqual(auProjectList[0].aureliaProgram, null);
  });
};
