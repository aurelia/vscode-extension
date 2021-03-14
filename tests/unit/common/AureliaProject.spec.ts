import { strictEqual } from 'assert';
import { AureliaExtension } from '../../../server/src/common/AureliaProject';

describe('AureliaProject', () => {
  it('#isAureliaProjectOpen', async () => {
    // @ts-ignore
    const testAureliaProject = new AureliaExtension({});
    const packageJsonPaths = [
      '/home/hdn/dev/vscode/aurelia/vscode-extension/tests/testFixture/src/monorepo/package-aurelia/package.json',
      '/home/hdn/dev/vscode/aurelia/vscode-extension/tests/testFixture/src/monorepo/package-burelia/package.json',
      '/home/hdn/dev/vscode/aurelia/vscode-extension/tests/testFixture/src/monorepo/package-c/package.json',
    ];

    const aureliaProjectPaths = await testAureliaProject.getAureliaProjectPaths(
      packageJsonPaths
    );

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
});
