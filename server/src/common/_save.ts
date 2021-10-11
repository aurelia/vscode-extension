// /** Copied from AureliaProgram#~ */
// function getProjectFilePaths(
//   options: IProjectOptions = defaultProjectOptions
// ): string[] {
//   const { rootDirectory, exclude, include } = options;
//   const targetSourceDirectory = rootDirectory ?? ts.sys.getCurrentDirectory();

//   const finalExcludes: string[] = [];

//   if (exclude === undefined) {
//     const defaultExcludes = [
//       '**/node_modules',
//       'aurelia_project',
//       '**/out',
//       '**/build',
//       '**/dist',
//     ];
//     finalExcludes.push(...defaultExcludes);
//   }
//   // console.log('[INFO] Exclude paths globs: ');
//   // console.log(finalExcludes.join(', '));

//   let finalIncludes: string[] = [];

//   if (include !== undefined) {
//     finalIncludes = include;
//   }

//   // console.log('[INFO] Include paths globs: ');
//   // console.log(finalIncludes.join(', '));

//   const paths = ts.sys.readDirectory(
//     targetSourceDirectory,
//     ['ts'],
//     // ['ts', 'js', 'html'],
//     finalExcludes,
//     finalIncludes
//   );

//   return paths;
// }
