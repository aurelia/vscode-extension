import * as path from 'path';

import { TestError, testError } from './errors/TestErrors';
import {
  FixtureNames,
  getAbsPathFromFixtureDir,
  getFixtureDir,
} from './fixtures/get-fixture-dir';

const getAbsPathInMonorepo = getAbsPathFromFixtureDir('monorepo');
const getAbsPathInCliGenerated = getAbsPathFromFixtureDir('cli-generated');
const getAbsPathInScopedForTesting =
  getAbsPathFromFixtureDir('scoped-for-testing');

// prettier-ignore
export const MONOREPO = {
  'root': getFixtureDir('monorepo'),
  'package-aurelia': getAbsPathInMonorepo('package-aurelia'),
  'aurelia': getAbsPathInMonorepo('package-aurelia/aurelia'),
  'aurelia.ts': getAbsPathInMonorepo('package-aurelia/src/aurelia.ts'),
  'aurelia.html': getAbsPathInMonorepo('package-aurelia/src/aurelia.html'),
  'package-burelia': getAbsPathInMonorepo('package-burelia'),
  'burelia': getAbsPathInMonorepo('package-burelia/burelia'),
  'burelia.ts': getAbsPathInMonorepo('package-burelia/src/burelia.ts'),
  'burelia.html': getAbsPathInMonorepo('package-burelia/src/burelia.html'),
  'package-c': getAbsPathInMonorepo('package-c'),
  'tsconfig.json': getAbsPathInMonorepo('tsconfig.json'),
};

// prettier-ignore
export const CLI_GENERATED = {
  'root': getFixtureDir('cli-generated'),
  'minimal-component': getAbsPathInCliGenerated('src/minimal-component'),
  'minimal-component.ts': getAbsPathInCliGenerated('src/minimal-component/minimal-component.ts'),
  'minimal-component.html': getAbsPathInCliGenerated('src/minimal-component/minimal-component.html'),
  'compo-user.html': getAbsPathInCliGenerated('src/compo-user/compo-user.html'),
  'view-model-test.html': getAbsPathInCliGenerated('src/view-model-test/view-model-test.html'),
  'realdworld-advanced/settings/index.html': getAbsPathInCliGenerated('src/realdworld-advanced/settings/index.html'),
  'tsconfig.json': getAbsPathInCliGenerated('tsconfig.json'),
};

// prettier-ignore
export const SCOPED_FOR_TESTING = {
  'root': getFixtureDir('scoped-for-testing'),
  // specific
  'stage4.html': getAbsPathInScopedForTesting('src/specific/stage4/stage4.html'),
  // view
  'custom-element-user.html': getAbsPathInScopedForTesting('src/view/custom-element/custom-element-user.html'),
  'custom-element-user.ts': getAbsPathInScopedForTesting('src/view/custom-element/custom-element-user.ts'),
  'custom-element.html': getAbsPathInScopedForTesting('src/view/custom-element/custom-element.html'),
  'custom-element.ts': getAbsPathInScopedForTesting('src/view/custom-element/custom-element.ts'),
  'empty-view.ts': getAbsPathInScopedForTesting('src/view/empty-view.ts'),
  'empty-view.html': getAbsPathInScopedForTesting('src/view/empty-view.html'),
  'other-custom-element-user.html': getAbsPathInScopedForTesting('src/view/custom-element/other-custom-element-user.html'),
  'view-diagnostics.html': getAbsPathInScopedForTesting('src/view/diagnostics/view-diagnostics.html')
};

/**
 * TODO: put somewhere else
 */
export function getPathsFromFileNames(uri: string, fileNames: string[]) {
  return fileNames.map((fileName) => {
    const pathMock = getPathMocksFromUri(uri);
    const path = pathMock[fileName];

    if (path === undefined) {
      throw new TestError(`${fileName} does not exist in ${uri}`);
    }

    return path;
  });
}

function getPathMocksFromUri(uri: string): Record<string, string> {
  const basename = path.basename(uri) as FixtureNames;
  testError.verifyProjectName(basename);

  switch (basename) {
    case 'cli-generated': {
      return CLI_GENERATED;
    }
    case 'monorepo': {
      return MONOREPO;
    }
    case 'scoped-for-testing': {
      return SCOPED_FOR_TESTING;
    }
    default: {
      return {};
    }
  }
}
