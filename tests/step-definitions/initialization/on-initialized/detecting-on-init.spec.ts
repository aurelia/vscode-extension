import { strictEqual } from 'assert';
import * as fs from 'fs';

import { StepDefinitions } from 'jest-cucumber';

import { FixtureNames } from '../../../common/fixtures/get-fixture-dir';
import {
  myMockServer,
  theProjectIsNamed,
} from '../../capabilities/new-common/project.step';

export const commonExtensionSteps: StepDefinitions = ({ given, then }) => {
  given(/^the project is named "(.*)"$/, async (projectName: FixtureNames) => {
    const myPath =
      // 'C:\\Users\\hdn local\\Desktop\\dev\\aurelia\\vscode-extension\\tests\\unit\\step-definitions\\embeddedLanguages\\embedded-support.spec.ts';
      'C:/Users/hdn local/Desktop/dev/aurelia/vscode-extension/tests/unit/step-definitions/embeddedLanguages/embedded-support.spec.ts';

    fs.readFileSync(myPath); /* ? */

    theProjectIsNamed(projectName);
  });

  then('the extension should not activate', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getAll();
    strictEqual(auProjects.length, 0);

    // expect(AureliaProjects.hydrate).not.toHaveBeenCalled();
  });
};

export const cliGenerateSteps: StepDefinitions = ({ given, then }) => {
  given(/^I open VSCode with no active files$/, async () => {
    // const mockTextDocuments = myMockServer.textDocuments.mock().getAll();
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    spyOn(AureliaProjects, 'hydrate');

    await myMockServer.getAureliaServer().onConnectionInitialized({
      aureliaProject: {
        rootDirectory: myMockServer.getWorkspaceUri(),
      },
    });
  });

  then('the extension should detect the Aurelia project', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getAll();
    expect(auProjects.length).toBeGreaterThan(0);
    // expect(AureliaProjects.hydrate).toHaveBeenCalled();
    // expect(auProjects[0].aureliaProgram).toBe(null);
    // TODO: how to simulate "no active file, ie. extension should not activate"
  });

  then('the extension should detect all Aurelia projects', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const auProjects = AureliaProjects.getAll();
    expect(auProjects.length).toBeGreaterThanOrEqual(2);
    // expect(AureliaProjects.hydrate).toHaveBeenCalled();
  });
};
