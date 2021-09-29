import * as path from 'path';

import { findProjectRoot } from '../find-project-root';

const projectRoot = findProjectRoot();
const testFixtureDir = path.resolve(projectRoot, 'tests/testFixture');

export const FIXTURE_NAMES = [
  'cli-generated',
  'monorepo',
  'non-aurelia-project',
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

export const getAbsPathFromFixtureDir = (fixtureName: FixtureNames) => (
  relPath: string
): string => {
  const absPath = path.resolve(testFixtureDir, fixtureName, relPath);
  return absPath;
};
