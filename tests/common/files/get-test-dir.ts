import * as path from 'path';

import { findProjectRoot } from '../find-project-root';

export function getTestDir(): string {
  const testDir = path.resolve(findProjectRoot(), 'tests'); /* ? */
  return testDir;
}
