import { pathToFileURL } from 'url';

export class UriUtils {
  public static toPath(fileUri: string): string {
    if (fileUri.includes('file:///')) {
      return fileUri.replace(/^file:\/\//, '');
    }

    return fileUri.replace(/^file:\//, '');
  }

  public static toUri(filePath: string): string {
    return pathToFileURL(filePath).href;
  }
}
