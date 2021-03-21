import { strictEqual } from 'assert';
import {
  AureliaExtension,
  getAureliaProjectPaths,
} from '../../../server/src/common/AureliaExtension';
import { globalContainer } from '../../../server/src/container';
import { onConnectionInitialized } from '../../../server/src/aureliaServer';
import { IAureliaProjectSetting } from '../../../server/src/configuration/DocumentSettings';


async function aureliaExtensionE2eSetup(aureliaProject: IAureliaProjectSetting) {
  await onConnectionInitialized(
    globalContainer,
    aureliaProject.rootDirectory ?? '',
    {
      aureliaProject
    }
  );
}

describe('AureliaProject', () => {
  it('getAureliaProjectPaths', async () => {
    const packageJsonPaths = [
      '/home/hdn/dev/vscode/aurelia/vscode-extension/tests/testFixture/src/monorepo/package-aurelia/package.json',
      '/home/hdn/dev/vscode/aurelia/vscode-extension/tests/testFixture/src/monorepo/package-burelia/package.json',
      '/home/hdn/dev/vscode/aurelia/vscode-extension/tests/testFixture/src/monorepo/package-c/package.json',
    ];

    const aureliaProjectPaths = await getAureliaProjectPaths(packageJsonPaths);

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

  it.skip('#hydrateAureliaProjectMap - Include', async () => {
    const rootDirectory = '/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.274/projects/61999828a40b7e5c/instrumented/tests/testFixture/src/monorepo';
    await aureliaExtensionE2eSetup({
      include: ['aurelia'],
      exclude: undefined,
      rootDirectory
    },);
    const testAureliaExtension = globalContainer.get(AureliaExtension);

    await testAureliaExtension.hydrateAureliaProjectMap();
    const auProjectMap = testAureliaExtension.getAureliaProjectMap();
    strictEqual(auProjectMap.size, 1);

    auProjectMap.forEach((aureliaProgram, key) => {
      const compList = aureliaProgram?.getComponentList();
      strictEqual(compList?.length, 1);
      strictEqual(compList[0].componentName, 'aurelia');
    })
  });

  it('#hydrateAureliaProjectMap - Include', async () => {
    const rootDirectory = '/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.274/projects/61999828a40b7e5c/instrumented/tests/testFixture/src/monorepo';
    await aureliaExtensionE2eSetup({
      include: [],
      exclude: undefined,
      rootDirectory
    },);
    const testAureliaExtension = globalContainer.get(AureliaExtension);

    await testAureliaExtension.hydrateAureliaProjectMap();
    const auProjectMap = testAureliaExtension.getAureliaProjectMap();
    strictEqual(auProjectMap.size, 2);

    auProjectMap.forEach((aureliaProgram, key) => {

      if (key.includes('package-aurelia')) {
        const compList = aureliaProgram?.getComponentList();
        strictEqual(compList?.length, 1);
        strictEqual(compList[0].componentName, 'aurelia');
      } else if (key.includes('package-burelia')) {
        const compList = aureliaProgram?.getComponentList();
        strictEqual(compList?.length, 1);
        strictEqual(compList[0].componentName, 'burelia');
      }
    })
  });
});
