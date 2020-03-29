import * as Path from 'path';

/**
 * Note, this function's logic was taken from `ProcessFiles.ts`
 *
 * @param path - Path of a file
 * @returns file name in kebab case
 *
 * @example
 * const path = '/Users/abc/Desktop/aurelia-example/src/my-text.html'
 * const result = getFileNameAsKebabCase(path);
 * result // my-text
 *
 * const path = '/Users/abc/Desktop/aurelia-example/src/MyOtherText.ts'
 * const result = getFileNameAsKebabCase(path);
 * result // my-other-text
 */
export function getFileNameAsKebabCase(path: string): string {
  return Path.basename(path).replace(/\.(ts|js|html)$/, '').split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
}
