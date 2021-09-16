import {
  getAbsPathFromFixtureDir,
  getFixtureDir,
} from './fixtures/get-fixture-dir';

const getAbsPathInMonorepo = getAbsPathFromFixtureDir('monorepo');
const getAbsPathInCliGenerated = getAbsPathFromFixtureDir('cli-generated');

// prettier-ignore
export const MONOREPO = {
  'root': getFixtureDir('monorepo'),
  'package-aurelia': getAbsPathInMonorepo('package-aurelia'),
  'aurelia': getAbsPathInMonorepo('package-aurelia/aurelia'),
  'aurelia.ts': getAbsPathInMonorepo('package-aurelia/aurelia/aurelia.ts'),
  'aurelia.html': getAbsPathInMonorepo('package-aurelia/aurelia/aurelia.html'),
  'package-burelia': getAbsPathInMonorepo('package-burelia'),
  'burelia': getAbsPathInMonorepo('package-burelia/burelia'),
  'burelia.ts': getAbsPathInMonorepo('package-burelia/burelia/burelia.ts'),
  'burelia.html': getAbsPathInMonorepo('package-burelia/burelia/burelia.html'),
  'package-c': getAbsPathInMonorepo('package-c'),
  'tsconfig.json': getAbsPathInMonorepo('tsconfig.json'),
};

export const CLI_GENERATED = {
  root: getFixtureDir('cli-generated'),
  'minimal-component': getAbsPathInCliGenerated('src/minimal-component'),
  'minimal-component.ts': getAbsPathInCliGenerated(
    'src/minimal-component/minimal-component.ts'
  ),
  'tsconfig.json': getAbsPathInCliGenerated('tsconfig.json'),

};
