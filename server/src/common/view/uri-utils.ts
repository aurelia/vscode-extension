import { fileURLToPath, pathToFileURL } from 'url';

export class UriUtils {
  static toPath(fileUri: string): string {
    if (fileUri.includes('file:///')) {
      return fileUri.replace(/^file:\/\//, '');
    }

    return fileUri.replace(/^file:\//, '');
  }

  static toUri(filePath: string): string {
    return pathToFileURL(filePath).href;
  }
}
