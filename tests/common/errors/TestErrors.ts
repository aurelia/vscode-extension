import { getPathsFromFileNames } from '../file-path-mocks';
import { FixtureNames, FIXTURE_NAMES } from '../fixtures/get-fixture-dir';

export class TestError extends Error {
  message: string;

  constructor(message?: string) {
    const finalMessage = `[TestError] ${message}`;
    super(finalMessage);
  }

  log(message: string): void {
    console.log(`[TestError] ${message}`);
  }

  public verifyProjectName(projectName: FixtureNames): void {
    if (!FIXTURE_NAMES.includes(projectName)) {
      this.logWrongProjectName(projectName);
    }
  }

  public verifyFileInProject(uri, fileName: string): void {
    const paths = getPathsFromFileNames(uri, [fileName]);
    const fileDoesNotExist = paths.some((path) => path === undefined);

    if (fileDoesNotExist) {
      this.logFileNotExistInProject(fileName);
    }
  }

  private logWrongProjectName(projectName: FixtureNames): void {
    throw new TestError(`Wrong project name: ${projectName}`);
  }

  private logFileNotExistInProject(fileName: string): void {
    throw new TestError(`Wrong project name: ${fileName}`);
  }
}

export const testError = new TestError();
