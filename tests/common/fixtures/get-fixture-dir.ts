import * as path from 'path';
import { UriUtils } from '../../../server/src/common/view/uri-utils';

import { findProjectRoot } from '../find-project-root';

const projectRoot = findProjectRoot();
const testFixtureDir = path.resolve(projectRoot, 'tests/testFixture');
// const testFixtureDir = path.resolve(projectRoot, getTestDir(), 'testFixture');

export const FIXTURE_NAMES = [
  'cli-generated',
  'monorepo',
  'non-aurelia-project',
  'scoped-for-testing',
] as const;
export type FixtureNames = typeof FIXTURE_NAMES[number];

export function getFixtureDir(fixtureName: FixtureNames): string {
  const cliGeneratedFixtureDir = path.resolve(
    projectRoot,
    `${testFixtureDir}/${fixtureName}`
  );
  return cliGeneratedFixtureDir;
}

export function getFixtureUri(fixtureName: FixtureNames): string {
  const fixtureUri = `file:/${getFixtureDir(fixtureName)}`;

  return fixtureUri;
}

export const getAbsPathFromFixtureDir =
  (fixtureName: FixtureNames) =>
  (relPath: string): string => {
    let absPath = path.resolve(testFixtureDir, fixtureName, relPath);
    if (path.sep === '\\') {
      // absPath = UriUtils.normalize(absPath);
      absPath = UriUtils.toSysPath(absPath);
      // absPath = UriUtils.toUri(absPath);
    }
    return absPath;
  };
