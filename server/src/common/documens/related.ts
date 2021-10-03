import * as path from 'path';
import * as fs from 'fs';

/**
 * @param fullPath - Full path of the file, which triggered the command
 * @param relatedExts - Possible extensions, for target file
 * @returns targetFile
 */
export function getRelatedFilePath(
  fullPath: string,
  relatedExts: string[]
): string {
  let targetFile: string = '';
  try {
    relatedExts.forEach((ext) => {
      const fileName = `${path.basename(
        fullPath,
        path.extname(fullPath)
      )}${ext}`.replace('.spec.spec', '.spec'); // Quick fix because we are appending eg. '.spec.ts' to 'file.spec'
      fullPath = path.join(path.dirname(fullPath), fileName);
      if (!fs.existsSync(fullPath)) return;
      targetFile = fullPath;
    });
  } catch (error) {
    console.log(error);
  }
  return targetFile;
}
