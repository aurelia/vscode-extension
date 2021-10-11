import * as fs from 'fs';
import * as path from 'path';

import * as fastGlob from 'fast-glob';
import { ts } from 'ts-morph';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  DocumentSettings,
  ExtensionSettings,
} from '../feature/configuration/DocumentSettings';
import { AureliaTsMorph } from './ts-morph/aurelia-ts-morph';
import { IProjectOptions, defaultProjectOptions } from '../common/common.types';
import { Logger } from '../common/logging/logger';
import { AureliaProgram } from './viewModel/AureliaProgram';
import { fileURLToPath } from 'url';

const logger = new Logger('AureliaProjectFiles');

let compilerObject: ts.Program | undefined;

export interface IAureliaProject {
  tsConfigPath: string;
  aureliaProgram: AureliaProgram | null;
}

export class AureliaProjects {
  private readonly aureliaProjects: IAureliaProject[] = [];

  public constructor(
    public readonly aureliaTsMorph: AureliaTsMorph,
    public readonly documentSettings: DocumentSettings
  ) {}

  public async set(packageJsonPaths: string[]) {
    const aureliaProjectPaths = getAureliaProjectPaths(packageJsonPaths);

    aureliaProjectPaths.forEach((aureliaProjectPath) => {
      const filePaths = getProjectFilePaths({
        ...this.documentSettings.getSettings().aureliaProject,
        rootDirectory: aureliaProjectPath,
      });

      if (filePaths.length === 0) {
        /* prettier-ignore */ logger.culogger.debug([ `Not including path ${aureliaProjectPath}, because it was excluded or not included.`, ], { logLevel: 'INFO', log: true });
        return;
      }

      const alreadyHasProject = this.aureliaProjects.find(
        (project) => project.tsConfigPath === aureliaProjectPath
      );

      if (alreadyHasProject) {
        return;
      }

      this.aureliaProjects.push({
        tsConfigPath: aureliaProjectPath,
        aureliaProgram: null,
      });
    });
  }

  public get(): AureliaProjects['aureliaProjects'] {
    return this.aureliaProjects;
  }

  public getFirst(): IAureliaProject {
    return this.aureliaProjects[0];
  }

  public async setAndVerify(extensionSettings: ExtensionSettings) {
    const packageJsonPaths = getPackageJsonPaths(extensionSettings);
    await this.set(packageJsonPaths);
    const projects = this.get();
    const hasAureliaProject = projects.length > 0;

    if (!hasAureliaProject) {
      logHasNoAureliaProject();
      return;
    }
    logFoundAureliaProjects(projects);
  }

  /**
   * [PERF]: 2.5s
   */
  public async hydrate(documentsPaths: string[]) {
    /** TODO: Makes esnse? */
    if (documentsPaths.length === 0) return;

    const aureliaProjects = this.get();
    const settings = this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;

    // 1. To each map assign a separate program
    /** TODO rename: tsConfigPath -> projectPath (or sth else) */
    aureliaProjects.forEach(async ({ tsConfigPath, aureliaProgram }) => {
      const shouldActive = documentsPaths.some((docPath) => {
        const result = docPath.includes(tsConfigPath);
        return result;
      });
      if (!shouldActive) return;

      const projectOptions = {
        ...aureliaProjectSettings,
        rootDirectory: tsConfigPath,
      };

      if (aureliaProgram === null) {
        aureliaProgram = new AureliaProgram();
      }

      if (!compilerObject) {
        const tsMorphProject = this.aureliaTsMorph.getTsMorphProject();
        const program = tsMorphProject.getProgram();
        // [PERF]: 1.87967675s
        compilerObject = program.compilerObject;
        aureliaProgram.setTsMorphProject(tsMorphProject);
      }

      aureliaProgram.setBuilderProgram(compilerObject);

      // [PERF]: 0.67967675s
      aureliaProgram.updateAureliaComponents(projectOptions);

      const targetAureliaProject = aureliaProjects.find(
        (auP) => auP.tsConfigPath === tsConfigPath
      );

      if (!targetAureliaProject) return;

      targetAureliaProject.aureliaProgram = aureliaProgram;
    });
  }

  public async hydrateWithActiveDocuments(activeDocuments: TextDocument[]) {
    /* prettier-ignore */ logger.culogger.debug(['Parsing Aurelia related data...'], { logLevel: 'INFO', });

    const activeDocumentPaths = activeDocuments.map((activeDocument) => {
      const documentPath = fileURLToPath(path.normalize(activeDocument.uri));
      return documentPath;
    });
    await this.hydrate(activeDocumentPaths);
    /* prettier-ignore */ logger.culogger.debug(['Parsing done. Aurelia Extension is ready.'], { logLevel: 'INFO', });
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

function getPackageJsonPaths(extensionSettings: ExtensionSettings) {
  const workspaceRootUri =
    extensionSettings.aureliaProject?.rootDirectory ?? '';
  const cwd = fileURLToPath(path.normalize(workspaceRootUri));
  const packageJsonPaths = fastGlob.sync('**/package.json', {
    absolute: true,
    ignore: ['node_modules'],
    cwd,
  });
  return packageJsonPaths;
}

function logFoundAureliaProjects(aureliaProjects: IAureliaProject[]) {
  /* prettier-ignore */ logger.culogger.debug([`Found ${aureliaProjects.length} Aurelia projects in: `], { logLevel: 'INFO', });
  aureliaProjects.forEach(({ tsConfigPath }) => {
    /* prettier-ignore */ logger.culogger.debug([tsConfigPath], { logLevel: 'INFO', });
  });
}

function logHasNoAureliaProject() {
  /* prettier-ignore */ logger.culogger.debug(['No active Aurelia project found.'], { logLevel: 'INFO', });
  /* prettier-ignore */ logger.culogger.debug([ 'Extension will activate, as soon as a file inside an Aurelia project is opened.', ], { logLevel: 'INFO' });
}
