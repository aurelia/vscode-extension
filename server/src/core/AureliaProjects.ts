import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import * as fastGlob from 'fast-glob';
import { ts } from 'ts-morph';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Logger } from '../common/logging/logger';
import { uriToPath } from '../common/uriToPath';
import {
  DocumentSettings,
  ExtensionSettings,
  IAureliaProjectSetting,
} from '../feature/configuration/DocumentSettings';
import { AureliaProgram } from './viewModel/AureliaProgram';

const logger = new Logger('AureliaProjectFiles');

let compilerObject: ts.Program | undefined;

export interface IAureliaProject {
  tsConfigPath: string;
  aureliaProgram: AureliaProgram | null;
}

export class AureliaProjects {
  private readonly aureliaProjects: IAureliaProject[] = [];

  public constructor(public readonly documentSettings: DocumentSettings) {}

  public async initAndVerify(extensionSettings: ExtensionSettings) {
    const packageJsonPaths = getPackageJsonPaths(extensionSettings);
    await this.init(packageJsonPaths);
    const projects = this.getAll();
    const hasAureliaProject = projects.length > 0;

    if (!hasAureliaProject) {
      logHasNoAureliaProject();
      return;
    }
    logFoundAureliaProjects(projects);
  }

  public getAll(): IAureliaProject[] {
    return this.aureliaProjects;
  }

  public getBy(tsConfigPath: string): IAureliaProject | undefined {
    const target = this.getAll().find(
      (projects) => projects.tsConfigPath === tsConfigPath
    );

    return target;
  }

  public getFromPath(documentPath: string): IAureliaProject | undefined {
    const target = this.getAll().find((project) =>
      documentPath.includes(project.tsConfigPath)
    );
    return target;
  }

  public getFromUri(uri: string): IAureliaProject | undefined {
    return this.getFromPath(uri);
  }

  /**
   * [PERF]: 2.5s
   */
  public async hydrate(documents: TextDocument[]) {
    /* prettier-ignore */ logger.culogger.debug(['Parsing Aurelia related data...'], { logLevel: 'INFO', });
    /** TODO: Makes esnse? */
    const documentsPaths = uriToPath(documents);
    if (documentsPaths.length === 0) return;

    const settings = this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;

    // 1. To each map assign a separate program
    await this.addAureliaProgramToEachProject(
      documentsPaths,
      aureliaProjectSettings
    );

    /* prettier-ignore */ logger.culogger.debug(['Parsing done. Aurelia Extension is ready.'], { logLevel: 'INFO', });
  }

  /**
   * Prevent when
   * 1. Project already includes document
   * 2. Document was just opened
   */
  public preventHydration(document: TextDocument): boolean {
    // 1.
    if (!this.isDocumentIncluded(document)) {
      return false;
    }

    // 2.
    if (hasDocumentChanged(document)) {
      return false;
    }

    logger.culogger.todo(
      `What should happen to document, that is not included?: ${document.uri}`
    );

    return true;
  }

  public updateManyViewModel(documents: TextDocument[]) {
    documents.forEach((document) => {
      const targetProject = this.getAll().find((project) =>
        document.uri.includes(project.tsConfigPath)
      );

      const aureliaProgram = targetProject?.aureliaProgram;
      if (!aureliaProgram) return;

      aureliaProgram.aureliaComponents.updateOne(
        aureliaProgram.tsMorphProject.get(),
        document
      );
    });
  }

  private async init(packageJsonPaths: string[]) {
    const aureliaProjectPaths = getAureliaProjectPaths(packageJsonPaths);

    aureliaProjectPaths.forEach((aureliaProjectPath) => {
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

  private async addAureliaProgramToEachProject(
    documentsPaths: string[],
    aureliaProjectSettings: IAureliaProjectSetting | undefined
  ) {
    const aureliaProjects = this.getAll();

    /** TODO rename: tsConfigPath -> projectPath (or sth else) */
    aureliaProjects.forEach(async ({ tsConfigPath, aureliaProgram }) => {
      const shouldActivate = getShouldActivate(documentsPaths, tsConfigPath);
      if (!shouldActivate) return;

      if (aureliaProgram === null) {
        aureliaProgram = new AureliaProgram(this.documentSettings);
        if (!compilerObject) {
          const tsMorphProject = aureliaProgram.tsMorphProject.create();
          const program = tsMorphProject.getProgram();
          // [PERF]: 1.87967675s
          compilerObject = program.compilerObject;
        }
        aureliaProgram.setProgram(compilerObject);
      }

      const projectOptions = {
        ...aureliaProjectSettings,
        rootDirectory: tsConfigPath,
      };
      // [PERF]: 0.67967675s
      aureliaProgram.initAureliaComponents(projectOptions);

      const targetAureliaProject = aureliaProjects.find(
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
  private isDocumentIncluded({ uri }: TextDocument): boolean {
    const isIncluded = this.aureliaProjects.some(({ tsConfigPath }) => {
      return uri.includes(tsConfigPath);
    });
    return isIncluded;
  }
}

function getShouldActivate(documentsPaths: string[], tsConfigPath: string) {
  return documentsPaths.some((docPath) => {
    const result = docPath.includes(tsConfigPath);
    return result;
  });
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
function getAureliaProjectPaths(packageJsonPaths: string[]): string[] {
  const aureliaProjectsRaw = packageJsonPaths.filter((packageJsonPath) => {
    const isAu = isAureliaProjectBasedOnPackageJson(packageJsonPath);
    return isAu;
  });
  const aureliaProjectPaths = aureliaProjectsRaw.map((aureliaProject) => {
    const dirName = path.dirname(aureliaProject);
    return dirName;
  });

  return aureliaProjectPaths;
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

/**
 * Document changes -> version > 1.
 */
function hasDocumentChanged({ version }: TextDocument): boolean {
  return version > 1;
}
