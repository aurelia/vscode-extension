import { fileURLToPath, pathToFileURL } from 'url';

export class UriUtils {
  static toPath(fileUri: string): string {
    return fileUri.replace(/^file:\//, '');
  }

  static toUri(filePath: string): string {
    return pathToFileURL(filePath).href;
  }
}
