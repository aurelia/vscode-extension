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
