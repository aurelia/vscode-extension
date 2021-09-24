import { inject } from 'aurelia-dependency-injection';
import * as path from 'path';
import * as fs from 'fs';
import { ts } from 'ts-morph';
import { DocumentSettings } from '../configuration/DocumentSettings';
import { AureliaProgram } from '../viewModel/AureliaProgram';
import { IProjectOptions, defaultProjectOptions } from './common.types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Logger } from 'culog';
import { AureliaTsMorph } from './aurelia-ts-morph/aurelia-ts-morph';

const logger = new Logger({ scope: 'AureliaProjectFiles' });

export interface IAureliaProject {
  tsConfigPath: string;
  aureliaProgram: AureliaProgram | null;
}

@inject(AureliaTsMorph, DocumentSettings)
export class AureliaProjects {
  private aureliaProjects: IAureliaProject[] = [];
  // aureliaProjectMap: Map<string, any> = new Map();

  public constructor(
    public readonly aureliaTsMorph: AureliaTsMorph,
    public readonly documentSettings: DocumentSettings
  ) {}

  public async gatherProjectInfo() {}

  public async setAureliaProjects(packageJsonPaths: string[]) {
    const aureliaProjectPaths = getAureliaProjectPaths(packageJsonPaths);

    aureliaProjectPaths.forEach((aureliaProjectPath) => {
      const filePaths = getProjectFilePaths({
        ...this.documentSettings.getSettings().aureliaProject,
        rootDirectory: aureliaProjectPath,
      });

      if (filePaths.length === 0) {
        logger.debug(
          [
            `Not including path ${aureliaProjectPath}, because it was excluded or not included.`,
          ],
          { logLevel: 'INFO', log: true }
        );
        return;
      }

      this.aureliaProjects.push({
        tsConfigPath: aureliaProjectPath,
        aureliaProgram: null,
      });
    });
  }

  public getProjects(): AureliaProjects['aureliaProjects'] {
    return this.aureliaProjects;
  }

  public getFirstAureliaProject(): IAureliaProject {
    return this.aureliaProjects[0];
  }

  public async hydrateAureliaProjects(documentsPaths: string[]) {
    /** TODO: Makes esnse? */
    if (documentsPaths.length === 0) return;

    const aureliaProjectList = this.getProjects();
    const settings = this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;

    // 1. To each map assign a separate program
    /** TODO rename: tsConfigPath -> projectPath (or sth else) */
    aureliaProjectList.forEach(async ({ tsConfigPath, aureliaProgram }) => {
      const shouldActive = documentsPaths.some((docPath) => {
        const result = docPath.includes(tsConfigPath);
        return result;
      });
      if (!shouldActive) return;

      if (aureliaProgram !== null) {
        console.log('[WARNING] Found a value, but should be null.');
      }

      const projectOptions = {
        ...aureliaProjectSettings,
        rootDirectory: tsConfigPath,
      };

      aureliaProgram = new AureliaProgram();
      const program = this.aureliaTsMorph.getTsMorphProject().getProgram()
        .compilerObject;
      aureliaProgram.setBuilderProgram(program);
      aureliaProgram.updateAureliaComponents(projectOptions);

      const targetAureliaProject = aureliaProjectList.find(
        (auP) => auP.tsConfigPath === tsConfigPath
      );

      if (!targetAureliaProject) return;

      targetAureliaProject.aureliaProgram = aureliaProgram;
    });
  }

  /**
   * Check whether a textDocument (via its uri), if it is already included
   * in the Aurelia project.
   */
  public isDocumentIncluded({ uri }: TextDocument): boolean {
    const isIncluded = this.aureliaProjects.some(({ tsConfigPath }) => {
      return uri.includes(tsConfigPath);
    });
    return isIncluded;
  }
}

function isAureliaProjectBasedOnPackageJson(packageJsonPath: string): boolean {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const dep = packageJson['dependencies'];
  if (!dep) return false;
  const devDep = packageJson['devDependencies'];
  if (!devDep) return false;

  const isAuV1App = dep['aurelia-framework'] !== undefined;
  const isAuV1AppDev = devDep['aurelia-framework'] !== undefined;
  const isAuV1Plugin = dep['aurelia-binding'] !== undefined;
  const isAuV1PluginDev = devDep['aurelia-binding'] !== undefined;

  const isAuV2App = dep['aurelia'] !== undefined;
  const isAuV2AppDev = devDep['aurelia'] !== undefined;
  const isAuV2Plugin = dep['@aurelia/runtime'] !== undefined;
  const isAuV2PluginDev = devDep['@aurelia/runtime'] !== undefined;

  const isAuApp = isAuV1App || isAuV1AppDev || isAuV2App || isAuV2AppDev;
  const isAuPlugin =
    isAuV1Plugin || isAuV1PluginDev || isAuV2Plugin || isAuV2PluginDev;

  const isAu = isAuApp || isAuPlugin;

  return isAu;
}

/**
 * @param packageJsonPaths - All paths, that have a package.json file
 * @param activeDocuments - Current active documents (eg. on open of Editor)
 * @returns All project paths, that are an Aurelia project
 *
 * 1. Save paths to Aurelia project only.
 * 1.1 Based on package.json
 * 1.2 Detect if is Aurelia project
 */
function getAureliaProjectPaths(
  packageJsonPaths: string[]
  // activeDocuments: TextDocument[] = []
): string[] {
  const aureliaProjectsRaw = packageJsonPaths.filter((packageJsonPath) => {
    const isAu = isAureliaProjectBasedOnPackageJson(packageJsonPath);
    return isAu;
  });

  // const activeDocumentPaths = activeDocuments.map((activeDocument) => {
  //   const documentPath = fileURLToPath(path.normalize(activeDocument.uri));
  //   return documentPath;
  // });

  const aureliaProjectPaths = aureliaProjectsRaw.map((aureliaProject) => {
    const dirName = path.dirname(aureliaProject);
    return dirName;
  });
  // aureliaProjectPaths = aureliaProjectPaths.filter((aureliaProjectPath) => {
  //   const isOpen = activeDocumentPaths.some((activeDocumentPath) => {
  //     const isProject = activeDocumentPath.includes(aureliaProjectPath);
  //     return isProject;
  //   });
  //   return isOpen;
  // });

  return aureliaProjectPaths;
}

/** Copied from AureliaProgram#~ */
function getProjectFilePaths(
  options: IProjectOptions = defaultProjectOptions
): string[] {
  const { rootDirectory, exclude, include } = options;
  const targetSourceDirectory = rootDirectory ?? ts.sys.getCurrentDirectory();

  const finalExcludes: string[] = [];

  if (exclude === undefined) {
    const defaultExcludes = [
      '**/node_modules',
      'aurelia_project',
      '**/out',
      '**/build',
      '**/dist',
    ];
    finalExcludes.push(...defaultExcludes);
  }
  // console.log('[INFO] Exclude paths globs: ');
  // console.log(finalExcludes.join(', '));

  let finalIncludes: string[] = [];

  if (include !== undefined) {
    finalIncludes = include;
  }

  // console.log('[INFO] Include paths globs: ');
  // console.log(finalIncludes.join(', '));

  const paths = ts.sys.readDirectory(
    targetSourceDirectory,
    ['ts'],
    // ['ts', 'js', 'html'],
    finalExcludes,
    finalIncludes
  );

  return paths;
}
