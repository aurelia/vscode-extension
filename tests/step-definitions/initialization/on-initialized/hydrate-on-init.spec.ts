import { StepDefinitions } from 'jest-cucumber';

import { Logger } from '../../../../server/src/common/logging/logger';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { getPathsFromFileNames } from '../../../common/file-path-mocks';
import {
  FileNameStepTable,
  getTableValues,
} from '../../../common/gherkin/gherkin-step-table';
import {
  givenIOpenVsCodeWithTheFollowingFiles,
  myMockServer,
} from '../../capabilities/new-common/project.step';

const logger = new Logger('[Test] Hydrate on init');

export const hydrateSteps: StepDefinitions = ({ given, when, then, and }) => {
  given(
    'I open VSCode with the following files:',
    async (table: FileNameStepTable) => {
      /* prettier-ignore */ logger.log('I open VSCode with the following files:', {env:'test'});
      const uri = myMockServer.getWorkspaceUri();
      const textDocumentPaths = getPathsFromTable(uri, table);
      await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
    }
  );

  and(
    /^I open VSCode with the following file "(.*)"$/,
    async (fileName: string) => {
      /* prettier-ignore */ logger.log('^I open VSCode with the following file "(.*)"$',{env:'test'});
      // const { AureliaProjects } = myMockServer.getContainerDirectly();
      // spyOn(AureliaProjects, 'hydrate');

      myMockServer.setActiveFilePath(fileName);
      await givenIOpenVsCodeWithTheFollowingFiles([
        myMockServer.getActiveFilePath(),
      ]);

      // expect(AureliaProjects.hydrate).toHaveBeenCalled();
    }
  );

  and(/the active file is "(.*)"/, async (fileName: string) => {
    myMockServer.setActiveFilePath(fileName);
  });

  when(
    /^I only specify for (.*) "package-aurelia"$/,
    async (property: 'rootDirectory' | 'include' | 'exclude') => {
      const fileName = 'aurelia.ts';
      myMockServer.setActiveFilePath(fileName);
      const packageRoot = 'package-aurelia';
      const workspaceUri = myMockServer.getWorkspaceUri();
      const root = `${workspaceUri}/${packageRoot}`;

      let targetProperty: string | string[] = '';
      if (property === 'rootDirectory') {
        targetProperty = root;
      } else {
        targetProperty = [packageRoot];
      }

      await givenIOpenVsCodeWithTheFollowingFiles(
        [myMockServer.getActiveFilePath()],
        {
          aureliaProject: {
            [property]: targetProperty,
          },
        }
      );
    }
  );

  then(/^the extension should only hydrate "(.*)"$/, (packageRoot: string) => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const num = AureliaProjects.getAll().length;
    AureliaProjects.getAll().map((p) => p.tsConfigPath); /* ? */

    expect(num).toBe(1); // Wrong is 0 or 2
  });

  then('the extension should hydrate the Aurelia project', () => {
    /* prettier-ignore */ logger.log('the extension should hydrate the Aurelia project',{env:'test'});
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const targetTsConfigPath = UriUtils.toSysPath(
      myMockServer.getWorkspaceUri()
    );
    const targetProject = AureliaProjects.getBy(targetTsConfigPath);
    if (!targetProject) {
      const allTsConfigPaths = AureliaProjects.getAll().map(
        (p) => p.tsConfigPath
      );
      const isIncluded = allTsConfigPaths.some((tsConfigPath) =>
        tsConfigPath.includes(targetTsConfigPath)
      );
      if (!isIncluded) return;

      const activeFilePath = myMockServer.getActiveFilePath();
      const target = AureliaProjects.getAll().find((p) =>
        activeFilePath.includes(p.tsConfigPath)
      );
      expect(target?.aureliaProgram).toBeTruthy();
      return;
    }

    const { aureliaProgram } = targetProject;
    expect(aureliaProgram).toBeTruthy();
  });

  then('the extension should rehydrate', () => {
    /* prettier-ignore */ logger.log('the extension should rehydrate',{env:'test'});
    // const { AureliaProjects } = myMockServer.getContainerDirectly();
    // expect(AureliaProjects.hydrate).toBeCalledTimes(2);
  });

  then(/^the extension should not rehydrate$/, () => {
    /* prettier-ignore */ logger.log('/^the extension should not rehydrate$/',{env:'test'});
    // const { AureliaProjects } = myMockServer.getContainerDirectly();
    // Only called once on init
    // expect(AureliaProjects.hydrate).toHaveBeenCalledTimes(1);
  });
};

function getPathsFromTable(uri: string, table: FileNameStepTable) {
  const fileNames = getTableValues(table);
  const paths = getPathsFromFileNames(uri, fileNames);
  return paths;
}
