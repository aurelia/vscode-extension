// ---

// ('here'); /* ? */
// 0b110000000000_000_000000; /*?*/ // EOF =
// 0b100000000000_000_000000; /*?*/ // ExpressionTerminal =
// 0b010000000000_000_000000; /*?*/ // AccessScopeTerminal =
// 0b001000000000_000_000000; /*?*/ // ClosingToken =
// 0b000100000000_000_000000; /*?*/ // OpeningToken =
// 0b000010000000_000_000000; /*?*/ // BinaryOp =
// 0b000001000000_000_000000; /*?*/ // UnaryOp =
// 0b000000100000_000_000000; /*?*/ // LeftHandSide =
// 0b000000011000_000_000000; /*?*/ // StringOrNumericLiteral =
// 0b000000010000_000_000000; /*?*/ // NumericLiteral =
// 0b000000001000_000_000000; /*?*/ // StringLiteral =
// 0b000000000110_000_000000; /*?*/ // IdentifierName =
// 0b000000000100_000_000000; /*?*/ // Keyword =
// 0b000000000010_000_000000; /*?*/ // Identifier =
// 0b000000000001_000_000000; /*?*/ // Contextual =
// 0b000000000000_111_000000; /*?*/ // Precedence =
// 0b000000000000_000_111111; /*?*/ // Type =
// 0b000000000100_000_000000; /*?*/ // FalseKeyword =
// 0b000000000100_000_000001; /*?*/ // TrueKeyword =
// 0b000000000100_000_000010; /*?*/ // NullKeyword =
// 0b000000000100_000_000011; /*?*/ // UndefinedKeyword =
// 0b000000000110_000_000100; /*?*/ // ThisScope =
// 0b000000000110_000_000101; /*?*/ // // HostScope
// 0b000000000110_000_000110; /*?*/ // ParentScope =
// 0b010100100000_000_000111; /*?*/ // OpenParen =
// 0b000100000000_000_001000; /*?*/ // OpenBrace =
// 0b000000100000_000_001001; /*?*/ // Dot =
// 0b111000000000_000_001010; /*?*/ // CloseBrace =
// 0b111000000000_000_001011; /*?*/ // CloseParen =
// 0b110000000000_000_001100; /*?*/ // Comma =
// 0b010100100000_000_001101; /*?*/ // OpenBracket =
// 0b111000000000_000_001110; /*?*/ // CloseBracket =
// 0b110000000000_000_001111; /*?*/ // Colon =
// 0b110000000000_000_010000; /*?*/ // Question =
// 0b110000000000_000_010011; /*?*/ // Ampersand =
// 0b110000000000_000_010100; /*?*/ // Bar =
// 0b110010000000_010_010101; /*?*/ // BarBar =
// 0b110010000000_011_010110; /*?*/ // AmpersandAmpersand =
// 0b110010000000_100_010111; /*?*/ // EqualsEquals =
// 0b110010000000_100_011000; /*?*/ // ExclamationEquals =
// 0b110010000000_100_011001; /*?*/ // EqualsEqualsEquals =
// 0b110010000000_100_011010; /*?*/ // ExclamationEqualsEquals =
// 0b110010000000_101_011011; /*?*/ // LessThan =
// 0b110010000000_101_011100; /*?*/ // GreaterThan =
// 0b110010000000_101_011101; /*?*/ // LessThanEquals =
// 0b110010000000_101_011110; /*?*/ // GreaterThanEquals =
// 0b110010000100_101_011111; /*?*/ // InKeyword =
// 0b110010000100_101_100000; /*?*/ // InstanceOfKeyword =
// 0b010011000000_110_100001; /*?*/ // Plus =
// 0b010011000000_110_100010; /*?*/ // Minus =
// 0b000001000100_000_100011; /*?*/ // TypeofKeyword =
// 0b000001000100_000_100100; /*?*/ // VoidKeyword =
// 0b110010000000_111_100101; /*?*/ // Asterisk =
// 0b110010000000_111_100110; /*?*/ // Percent =
// 0b110010000000_111_100111; /*?*/ // Slash =
// 0b100000000000_000_101000; /*?*/ // Equals =
// 0b000001000000_000_101001; /*?*/ // Exclamation =
// 0b010000100000_000_101010; /*?*/ // TemplateTail =
// 0b010000100000_000_101011; /*?*/ // TemplateContinuation =
// 0b100000000101_000_101100; /*?*/ // OfKeyword =
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
