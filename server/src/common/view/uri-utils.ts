import * as nodePath from 'path';

export class UriUtils {
  /**
   * Convert path to how your system would use it.
   *
   * Re. Naming: Similar to `nodePath#normalize`, but I wanted to stress the vscode-uri vs. window-path fact.
   */
  public static toSysPath(path: string) {
    if (path.includes('file:')) {
      path = this.removeFileProtocol(path);
    }

    if (this.isWin()) {
      path = this.decodeWinPath(path);
    }

    path = nodePath.normalize(path);

    return path;
  }

  public static toSysPathMany(uris: string[]): string[] {
    const asPaths = uris.map((uri) => this.toSysPath(uri));
    return asPaths;
  }

  /**
   * Linux/macOS just prefix `file://`
   * Windows: convert backslash to forwardslash and encode
   */
  public static toVscodeUri(filePath: string): string {
    // filePath; /*?*/
    // const uri = pathToFileURL(filePath).href;
    let uri = filePath;
    if (this.isWin()) {
      uri = this.encodeWinPath(filePath);
    }
    uri = `file:///${uri}`;

    return uri;
  }

  public static isWin(): boolean {
    return nodePath.sep === '\\';
  }

  public static encodeWinPath(path: string): string {
    // C%3A/Users/hdn%20local/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.318/projects/01d527eb4e87d260/instrumented/tests/testFixture/scoped-for-testing/src/view/custom-element/other-custom-element-user.html
    let encodePath = path.replace(/\\\\?/g, () => '/');
    // fix colon
    encodePath = encodePath.replace(':', '%3A');
    // fix whitespace
    encodePath = encodePath.replace(' ', '%20');

    return encodePath;
  }

  private static decodeWinPath(path: string): string {
    // C%3A/Users/hdn%20local/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.318/projects/01d527eb4e87d260/instrumented/tests/testFixture/scoped-for-testing/src/view/custom-element/other-custom-element-user.html
    let winPath = path;
    if (winPath.startsWith('/')) {
      winPath = winPath.replace('/', '');
    }
    winPath = winPath.replace(/\//g, '\\');
    winPath = winPath.replace(/%3A/g, ':');
    winPath = winPath.replace(/%20/g, ' ');

    return winPath;
  }
  private static removeFileProtocol(fileUri: string): string {
    const removed = fileUri.replace(/^file:\/\/?\/?/g, '');
    return removed;
  }
}
