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

  private logWrongProjectName(projectName: FixtureNames): void {
    throw new TestError(`Wrong project name: ${projectName}`);
  }
}

export const testError = new TestError();
