// ---
// RegionParser.pretty(regions, {
//   asTable: true,
//   maxColWidth: 20,
//   ignoreKeys: [
//     'sourceCodeLocation',
//     'languageService',
//     'subType',
//     'accessScopes',
//     'tagName',
//     'startTagLocation',
//   ],
// });
// ---
// /** [Ignore] Seems useful, so keeping it for now */
// export function createProgram(
//   files: {
//     fileName: string;
//     content: string;
//     sourceFile?: ts.SourceFile;
//   }[],
//   compilerOptions?: ts.CompilerOptions
// ): ts.Program {
//   const tsConfigJson = ts.parseConfigFileTextToJson(
//     'tsconfig.json',
//     compilerOptions
//       ? JSON.stringify(compilerOptions)
//       : `{
//    "compilerOptions": {
//     "target": "es2018",
//     "module": "commonjs",
//     "lib": ["es2018"],
//     "rootDir": ".",
//     "strict": false,
//     "esModuleInterop": true,
//    }
//  `
//   );
//   const { options, errors } = ts.convertCompilerOptionsFromJson(
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     tsConfigJson.config.compilerOptions,
//     '.'
//   );
//   if (errors.length) {
//     throw errors;
//   }
//   const compilerHost = ts.createCompilerHost(options);
//   compilerHost.getSourceFile = function (
//     fileName: string
//   ): ts.SourceFile | undefined {
//     const file = files.find((f) => f.fileName === fileName);
//     if (!file) return undefined;
//     file.sourceFile =
//       file.sourceFile ??
//       ts.createSourceFile(fileName, file.content, ts.ScriptTarget.ES2015, true);
//     return file.sourceFile;
//   };
//   return ts.createProgram(
//     files.map((f) => f.fileName),
//     options,
//     compilerHost
//   );
// }
// ---
// if (tsConfigPath == null) {
//   const virtualTsConfigPath = `${targetSourceDirectory}/tsconfig.json`;
//   const tsConfigJson = ts.parseConfigFileTextToJson(
//     virtualTsConfigPath,
//     `{
//     "compilerOptions": {
//       "experimentalDecorators": true,
//       "module": "commonjs",
//       "target": "es6",
//       "rootDir": "${targetSourceDirectory}",
//       "sourceMap": true,
//     },
//     "include": ["src"],
//     "exclude": ["node_modules"]
//   }
//   `
//   ).config;

//   finalCustomCompilerOptions = {
//     ...finalCustomCompilerOptions,
//     ...tsConfigJson,
//   };
// }

// ---
// if (region === undefined) return [];

// // Approach similar to `aureliaVirtualComplete_vNext`,
// // where we create a virtual ts file to leverage ts language server completions
// // 1. Component
// const project = aureliaProgram.tsMorphProject.project;
// const targetComponent =
//   aureliaProgram.aureliaComponents.getOneByFromDocument(document);
// if (!targetComponent) return [];

// // 2. Virtual copy with content
// const sourceDocumentDir = path.dirname(UriUtils.toPath(document.uri));
// const COPY_PATH = `${sourceDocumentDir}/view-import.ts`;
// COPY_PATH; /*?*/
// const sourceFile = project.createSourceFile(
//   COPY_PATH
//   // targetComponent.viewModelFilePath
// );
// if (sourceFile === undefined) return [];
// const copy = sourceFile.copy(COPY_PATH, { overwrite: true });
// // const virtualImportContent = `import '${region.regionValue}'`;
// const virtualImportContent = `import '../'`;
// copy.replaceWithText(virtualImportContent);
// copy.getText(); /* ? */

// const languageService = project.getLanguageService().compilerObject;
// const completionsPos = virtualImportContent.length - 1; // import '...|'
// completionsPos; /*?*/
// const virtualCompletions = languageService.getCompletionsAtPosition(
//   COPY_PATH.replace('file:///', 'file:/'),
//   completionsPos,
//   {}
// );
// // ?.entries.filter((result) => {
// //   return result?.kind !== ts.ScriptElementKind['externalModuleName'];
// // });
// if (!virtualCompletions) {
//   project.removeSourceFile(copy);
//   return [];
// }

// virtualCompletions; /* ? */
// project.removeSourceFile(copy);

// ---
// export class AureliaHtmlRegion extends AbstractRegion {
//   public languageService: AureliaHtmlLanguageService;
//   public readonly type: ViewRegionType.Html;

//   constructor(info: ViewRegionInfoV2) {
//     super(info);
//     this.languageService = new AureliaHtmlLanguageService();
//   }

//   static create(info: Optional<ViewRegionInfoV2, 'type'>) {
//     const finalInfo = convertToRegionInfo({
//       ...info,
//       type: ViewRegionType.AttributeInterpolation,
//     });
//     return new AttributeInterpolationRegion(finalInfo);
//   }

//   public accept<T>(visitor: IViewRegionsVisitor<T>): T {
//     return visitor.visitAureliaHtmlInterpolation(this);
//   }
// }

// ----
// type AllClassOfRegions =
//   | AttributeRegion
//   | AttributeInterpolationRegion
//   | BindableAttributeRegion
//   | CustomElementRegion
//   | RepeatForRegion
//   | TextInterpolationRegion
//   | ValueConverterRegion;
// ----
// public updateManyViewModelClassMember(
//   documents: TextDocument[],
//   oldName: string,
//   newName: string
// ): void {
//   documents.forEach((document) => {
//     if (!this.isViewModelDocument(document)) return;

//     const targetProject = this.getAll().find((project) =>
//       document.uri.includes(project.tsConfigPath)
//     );
//     const components = targetProject?.aureliaProgram?.aureliaComponents.getAll();

//     if (!components) return;
//     let targetClassMember: IAureliaClassMember | undefined;
//     components.forEach((component) => {
//       const targetMember = component.classMembers?.find(
//         (member) => member.name === oldName
//       );
//       if (targetMember) {
//         targetClassMember = targetMember;
//       }
//     });

//     if (!targetClassMember) return;

//     targetClassMember.name = newName;
//   });
// }

// private isViewModelDocument(document: TextDocument) {
//   const settings = this.documentSettings.getSettings();
//   const scriptExtensions = settings?.relatedFiles?.script;
//   const isScript = scriptExtensions?.find((extension) =>
//     document.uri.endsWith(extension)
//   );
//   return isScript;
// }

// -------------------------

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
