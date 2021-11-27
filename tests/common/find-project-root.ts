import * as fs from 'fs';
import * as path from 'path';

/**
 *
 */
export function findProjectRoot(targetPath = __dirname): string {
  const parentPath = path.dirname(targetPath);

  try {
    const clientPath = `${parentPath}/client`;
    fs.accessSync(clientPath);
    const serverPath = `${parentPath}/server`;
    fs.accessSync(serverPath);

    return parentPath;
  } catch (error) {
    return findProjectRoot(parentPath);
  }
}
