
export class UriUtils {
  static toPath(fileUri: string): string {
    return fileUri.replace(/^file:\//,'');
  }
}
