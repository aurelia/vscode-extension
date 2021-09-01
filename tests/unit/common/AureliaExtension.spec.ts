import { strictEqual } from 'assert';
import {
  AureliaProjectFiles,
  getAureliaProjectPaths,
} from '../../../server/src/common/AureliaProjectFiles';
import { globalContainer } from '../../../server/src/container';
import { onConnectionInitialized } from '../../../server/src/core/aureliaServer';
import { IAureliaProjectSetting } from '../../../server/src/configuration/DocumentSettings';
import { DocumentUri, TextDocument } from 'vscode-languageserver-textdocument';
import path = require('path');
import { MockServer } from '../helpers/test-setup';

const testsDir = path.resolve(__dirname, '../..');
const monorepoFixtureDir = path.resolve(testsDir, 'testFixture/src/monorepo');
const rootDirectory = `file:/${monorepoFixtureDir}`;

export async function aureliaExtensionE2eSetup(
  aureliaProject: IAureliaProjectSetting,
  activeDocuments: TextDocument[] = []
) {
  await onConnectionInitialized(
    globalContainer,
    aureliaProject.rootDirectory ?? '',
    {
      aureliaProject,
    },
    activeDocuments
  );
}

describe('AureliaExtension', () => {
  it('getAureliaProjectPaths', async () => {
    const packageJsonPaths = [
      `${testsDir}/testFixture/src/monorepo/package-aurelia/package.json`,
      `${testsDir}/testFixture/src/monorepo/package-burelia/package.json`,
      `${testsDir}/testFixture/src/monorepo/package-c/package.json`,
    ];
    // prettier-ignore
    const auPath = path.resolve(monorepoFixtureDir, 'package-aurelia/aurelia/aurelia.ts');
    const auUri: DocumentUri = `file:${auPath}`;
    // prettier-ignore
    const buPath = path.resolve(monorepoFixtureDir, 'package-burelia/burelia/burelia.ts');
    const buUri: DocumentUri = `file:${buPath}`;

    const aureliaProjectPaths = await getAureliaProjectPaths(packageJsonPaths, [
      TextDocument.create(auUri, 'typescrip', 1, ''),
      TextDocument.create(buUri, 'typescrip', 1, ''),
    ]);

    strictEqual(aureliaProjectPaths.length, 2);

    strictEqual(
      aureliaProjectPaths[0].includes(
        '/tests/testFixture/src/monorepo/package-aurelia'
      ),
      true
    );
    strictEqual(
      aureliaProjectPaths[1].includes(
        '/tests/testFixture/src/monorepo/package-burelia'
      ),
      true
    );
  });

  it('#hydrateAureliaProjectMap - Include', async () => {
    const auPath = 'package-aurelia/aurelia/aurelia.ts';
    const mockServer = new MockServer();

    await mockServer.mockTextDocuments([auPath]).onConnectionInitialized({
      include: ['aurelia'],
    });

    const testAureliaExtension = globalContainer.get(AureliaProjectFiles);

    await testAureliaExtension.hydrateAureliaProjectList();
    const auProjectList = testAureliaExtension.getAureliaProjects();
    strictEqual(auProjectList.length, 1);

    auProjectList.forEach(({ aureliaProgram }) => {
      const compList = aureliaProgram?.getComponentList();
      strictEqual(compList?.length, 1);
      strictEqual(compList[0].componentName, 'aurelia');
    });
  });

  it('#hydrateAureliaProjectMap - Include', async () => {
    const auPath = 'package-aurelia/aurelia/aurelia.ts';
    const buPath = 'package-burelia/burelia/burelia.ts';
    const mockServer = new MockServer();

    await mockServer
      .mockTextDocuments([auPath, buPath])
      .onConnectionInitialized({
        include: ['aurelia', 'burelia'],
      });

    const testAureliaExtension = globalContainer.get(AureliaProjectFiles);

    await testAureliaExtension.hydrateAureliaProjectList();
    const auProjectList = testAureliaExtension.getAureliaProjects();
    strictEqual(auProjectList.length, 2);

    // auProjectList.forEach((aureliaProgram, key) => {
    auProjectList.forEach(({ aureliaProgram, tsConfigPath }) => {
      if (tsConfigPath.includes('package-aurelia')) {
        const compList = aureliaProgram?.getComponentList();
        strictEqual(compList?.length, 1);
        strictEqual(compList[0].componentName, 'aurelia');
      } else if (tsConfigPath.includes('package-burelia')) {
        const compList = aureliaProgram?.getComponentList();
        strictEqual(compList?.length, 1);
        strictEqual(compList[0].componentName, 'burelia');
      }
    });
  });
});
