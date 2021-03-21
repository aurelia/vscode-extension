import * as path from 'path';

const testsDir = path.resolve(__dirname, '../..');
const monorepoFixtureDir = path.resolve(testsDir, 'testFixture/src/monorepo');

const getAbsPath = (basePath) => (relPath: string): string => {
  const absPath = path.resolve(testsDir, basePath, relPath);
  return absPath;
};

const getAbsPathInMonorepo = getAbsPath('testFixture/src/monorepo');

// prettier-ignore
export const MONOREPO = {
  'root': monorepoFixtureDir,
  'package-aurelia': getAbsPathInMonorepo('package-aurelia'),
  'package-aurelia/aurelia': getAbsPathInMonorepo('package-aurelia/aurelia'),
  'package-aurelia/aurelia/aurelia.ts': getAbsPathInMonorepo('package-aurelia/aurelia/aurelia.ts'),
  'package-aurelia/aurelia/aurelia.html': getAbsPathInMonorepo('package-aurelia/aurelia/aurelia.html'),
  'package-burelia': getAbsPathInMonorepo('package-burelia'),
  'package-burelia/burelia': getAbsPathInMonorepo('package-burelia/burelia'),
  'package-burelia/burelia/burelia.ts': getAbsPathInMonorepo('package-burelia/burelia/burelia.ts'),
  'package-burelia/burelia/burelia.html': getAbsPathInMonorepo('package-burelia/burelia/burelia.html'),
  'package-c': getAbsPathInMonorepo('package-c'),
};
