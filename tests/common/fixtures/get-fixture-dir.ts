import { findProjectRoot } from '../find-project-root';
import * as path from 'path';

export const FIXTURE_NAMES = ['cli-generated', 'monorepo'] as const;
export type FixtureNames = typeof FIXTURE_NAMES[number];

export function getFixtureDir(fixtureName: FixtureNames): string {
  const testProjectRoot = findProjectRoot();
  const cliGeneratedFixtureDir = path.resolve(
    testProjectRoot,
    `tests/testFixture/${fixtureName}`
  );
  const fixtureUri = `file:/${cliGeneratedFixtureDir}`;

  return fixtureUri;
}
