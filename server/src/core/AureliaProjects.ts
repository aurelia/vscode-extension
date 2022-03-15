import * as fs from 'fs';
import * as nodePath from 'path';

import * as fastGlob from 'fast-glob';
import { Project, ts } from 'ts-morph';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProgram } from '../aot/AureliaProgram';
import { Logger } from '../common/logging/logger';
import { UriUtils } from '../common/view/uri-utils';
import {
  DocumentSettings,
  ExtensionSettings,
  IAureliaProjectSetting,
} from '../configuration/DocumentSettings';

const logger = new Logger('AureliaProject');

const compilerObjectMap = new Map<string, ts.Program | undefined>();

export interface IAureliaProject {
  /** TODO rename: tsConfigPath -> projectPath (or sth else) */
  tsConfigPath: string;
  aureliaProgram: AureliaProgram | null;
}

export class AureliaProjects {
  private aureliaProjects: IAureliaProject[] = [];
  private editingTracker: TextDocument[] = [];

  constructor(public readonly documentSettings: DocumentSettings) {}

  public async getAureliaProjectsOnly(extensionSettings: ExtensionSettings) {
    const packageJsonPaths = getPackageJsonPaths(extensionSettings);
    await this.initAndSet(packageJsonPaths);

    const hasAureliaProject = this.getHasAureliaProject();
    return hasAureliaProject;
  }

  private getHasAureliaProject() {
    const projects = this.getAll();
    const hasAureliaProject = projects.length > 0;

    if (!hasAureliaProject) {
      logHasNoAureliaProject();
      return false;
    }
    logFoundAureliaProjects(projects);
    return true;
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
    const target = this.getAll().find((project) => {
      const included = documentPath.includes(project.tsConfigPath);
      return included;
    });
    return target;
  }

  public getFromUri(uri: string): IAureliaProject | undefined {
    const path = UriUtils.toSysPath(uri);
    return this.getFromPath(path);
  }

  /**
   * [PERF]: 2.5s
   */
  public async hydrate(
    documents: TextDocument[],
    forceReinit: boolean = false
  ): Promise<boolean> {
    /* prettier-ignore */ logger.log('Parsing Aurelia related data...', { logLevel: 'INFO' });

    const documentsPaths = getDocumentPaths();
    if (!documentsPaths) return false;

    const settings = this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;
    // 1. To each map assign a separate program
    await this.addAureliaProgramToEachProject(
      documentsPaths,
      aureliaProjectSettings,
      forceReinit
    );

    return true;

    function getDocumentPaths() {
      const documentsPaths = documents.map((document) => {
        const result = UriUtils.toSysPath(document.uri);
        return result;
      });
      if (documentsPaths.length === 0) {
        warnExtensionNotActivated();
        return;
      }

      return documentsPaths;

      function warnExtensionNotActivated() {
        /* prettier-ignore */ logger.log('(!) Extension not activated.', { logLevel: 'INFO' });
        /* prettier-ignore */ logger.log('(!) Waiting until .html, .js, or .ts file focused.', { logLevel: 'INFO' });
        /* prettier-ignore */ logger.log('    (For performance reasons)', { logLevel: 'INFO' });
        /* prettier-ignore */ logger.log('    (Execute command "Aurelia: Reload Extension", if nothing happens.)', { logLevel: 'INFO' });
      }
    }
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

    // update: then extension should correctly(!) not active
    // logger.culogger.todo(
    //   `What should happen to document, that is not included?: ${document.uri}`
    // );
    logger.log(`Not updating document: ${nodePath.basename(document.uri)}`);
    return true;
  }

  public isHydrated(): boolean {
    const projects = this.getAll();
    const hydrated = projects.every(
      (project) => project.aureliaProgram !== null
    );
    return hydrated;
  }

  public updateManyViewModel(documents: TextDocument[]) {
    documents.forEach((document) => {
      const uriSysPath = UriUtils.toSysPath(document.uri);
      const targetProject = this.getAll().find((project) =>
        uriSysPath.includes(project.tsConfigPath)
      );

      const aureliaProgram = targetProject?.aureliaProgram;
      if (!aureliaProgram) return;

      aureliaProgram.aureliaComponents.updateOne(
        aureliaProgram.tsMorphProject.get(),
        document
      );
    });
  }

  public updateManyView(documents: TextDocument[]) {
    documents.forEach((document) => {
      const targetProject = this.getAll().find((project) =>
        UriUtils.toSysPath(document.uri).includes(project.tsConfigPath)
      );

      const aureliaProgram = targetProject?.aureliaProgram;
      if (!aureliaProgram) return;

      aureliaProgram.aureliaComponents.updateOneView(document);
    });
  }

  /** Tracker */

  public getEditingTracker(): TextDocument[] {
    return this.editingTracker;
  }

  public addDocumentToEditingTracker(document: TextDocument): void {
    this.editingTracker.push(document);
  }

  public clearEditingTracker(): void {
    this.editingTracker = [];
  }

  private async initAndSet(packageJsonPaths: string[]) {
    this.resetAureliaProjects();

    const aureliaProjectPaths = getAureliaProjectPaths(packageJsonPaths);
    aureliaProjectPaths.forEach((aureliaProjectPath) => {
      if (this.alreadyHasProject(aureliaProjectPath)) {
        return;
      }

      this.aureliaProjects.push({
        tsConfigPath: UriUtils.toSysPath(aureliaProjectPath),
        aureliaProgram: null,
      });
    });
  }

  private alreadyHasProject(aureliaProjectPath: string) {
    const alreadyHasProject = this.aureliaProjects.find(
      (project) => project.tsConfigPath === aureliaProjectPath
    );
    return alreadyHasProject;
  }

  private async addAureliaProgramToEachProject(
    documentsPaths: string[],
    aureliaProjectSettings: IAureliaProjectSetting | undefined,
    forceReinit: boolean = false
  ) {
    const aureliaProjects = this.getAll();

    aureliaProjects.forEach((aureliaProject) => {
      const { tsConfigPath } = aureliaProject;
      if (!shouldActivate(documentsPaths, tsConfigPath)) return;

      let aureliaProgram = this.getADefinedAureliaProgram(
        aureliaProject,
        forceReinit
      );

      aureliaProgram = this.initAureliaComponents(
        aureliaProgram,
        tsConfigPath,
        aureliaProjectSettings
      );

      setAureliaProgramToProject(aureliaProgram, tsConfigPath);
    });

    return;

    function setAureliaProgramToProject(
      aureliaProgram: AureliaProgram,
      tsConfigPath: string
    ) {
      const targetAureliaProject = aureliaProjects.find(
        (auP) => auP.tsConfigPath === tsConfigPath
      );
      if (!targetAureliaProject) return;
      targetAureliaProject.aureliaProgram = aureliaProgram;
    }
  }

  private getADefinedAureliaProgram(
    aureliaProject: IAureliaProject,
    forceReinit: boolean
  ) {
    const { tsConfigPath } = aureliaProject;
    let { aureliaProgram } = aureliaProject;
    if (aureliaProgram === null || forceReinit) {
      aureliaProgram = this.initAureliaProgram(tsConfigPath, forceReinit);
    }
    return aureliaProgram;
  }

  private initAureliaComponents(
    aureliaProgram: AureliaProgram,
    tsConfigPath: string,
    aureliaProjectSettings?: IAureliaProjectSetting
  ) {
    const projectOptions: IAureliaProjectSetting = {
      ...aureliaProjectSettings,
      rootDirectory: tsConfigPath,
    };
    // [PERF]: 0.67967675s
    aureliaProgram.initAureliaComponents(projectOptions);

    return aureliaProgram;
  }

  private initAureliaProgram(tsConfigPath: string, forceReinit: boolean) {
    const updatedSettings = this.updateDocumentSettings(tsConfigPath);
    const aureliaProgram = new AureliaProgram(updatedSettings);
    const tsMorphProject = aureliaProgram.tsMorphProject.create();
    const compilerObject = memoizeCompilerObject(tsConfigPath, tsMorphProject);
    if (compilerObject != null) {
      aureliaProgram.setProgram(compilerObject);
    }

    return aureliaProgram;

    function memoizeCompilerObject(
      tsConfigPath: string,
      tsMorphProject: Project
    ) {
      let compilerObject = compilerObjectMap.get(tsConfigPath);
      if (compilerObject == null || forceReinit) {
        const program = tsMorphProject.getProgram();
        // [PERF]: 1.87967675s
        compilerObject = program.compilerObject;
        compilerObjectMap.set(tsConfigPath, compilerObject);
      }
      return compilerObject;
    }
  }

  private updateDocumentSettings(tsConfigPath: string) {
    const extensionSettings =
      this.documentSettings.getSettings().aureliaProject;
    this.documentSettings.setSettings({
      ...extensionSettings,
      aureliaProject: {
        projectDirectory: tsConfigPath,
      },
    });

    return this.documentSettings;
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

  private resetAureliaProjects(): void {
    this.aureliaProjects = [];
  }
}

function shouldActivate(documentsPaths: string[], tsConfigPath: string) {
  return documentsPaths.some((docPath) => {
    const result = docPath.includes(tsConfigPath);
    return result;
  });
}

function isAureliaProjectBasedOnPackageJson(packageJsonPath: string): boolean {
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  ) as Record<string, Record<string, string>>;
  const dep = packageJson['dependencies'];
  let hasAuInDep = false;
  if (dep != null) {
    const isAuV1App = dep['aurelia-framework'] !== undefined;
    const isAuV1Plugin = dep['aurelia-binding'] !== undefined;
    const isAuV1Cli = dep['aurelia-cli'] !== undefined;
    const isAuV2App = dep['aurelia'] !== undefined;
    const isAuV2Plugin = dep['@aurelia/runtime'] !== undefined;

    const isAuApp = isAuV1App || isAuV1Cli || isAuV2App;
    const isAuPlugin = isAuV1Plugin || isAuV2Plugin;
    hasAuInDep = isAuApp || isAuPlugin;
  }

  let hasAuInDevDep = false;
  const devDep = packageJson['devDependencies'];
  if (devDep != null) {
    const isAuV1AppDev = devDep['aurelia-framework'] !== undefined;
    const isAuV1PluginDev = devDep['aurelia-binding'] !== undefined;
    const isAuV1CliDev = devDep['aurelia-cli'] !== undefined;
    const isAuV2AppDev = devDep['aurelia'] !== undefined;
    const isAuV2PluginDev = devDep['@aurelia/runtime'] !== undefined;

    const isAuApp = isAuV1AppDev || isAuV1CliDev || isAuV2AppDev;
    const isAuPlugin = isAuV1PluginDev || isAuV2PluginDev;
    hasAuInDevDep = isAuApp || isAuPlugin;
  }

  const isAu = hasAuInDep || hasAuInDevDep;

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
    const dirName = nodePath.dirname(UriUtils.toSysPath(aureliaProject));
    return dirName;
  });

  return aureliaProjectPaths;
}

function getPackageJsonPaths(extensionSettings: ExtensionSettings) {
  const aureliaProject = extensionSettings.aureliaProject;
  const workspaceRootUri = aureliaProject?.rootDirectory?.trim() ?? '';
  const cwd = UriUtils.toSysPath(workspaceRootUri);
  /* prettier-ignore */ logger.log(`Get package.json based on: ${cwd}`,{env:'test'});

  const ignore: string[] = [];
  const exclude = aureliaProject?.exclude;
  if (exclude != null) {
    ignore.push(...exclude);
  }
  const packageJsonInclude = aureliaProject?.packageJsonInclude;
  let globIncludePattern: string[] = [];
  if (packageJsonInclude != null && packageJsonInclude.length > 0) {
    /* prettier-ignore */ logger.log('Using setting `aureliaProject.packageJsonInclude`.', { logLevel: 'INFO' });

    const packageJsonIncludes = packageJsonInclude.map(
      (path) => `**/${path}/**/package.json`
    );
    globIncludePattern.push(...packageJsonIncludes);
  } else {
    globIncludePattern = ['**/package.json'];
  }

  try {
    const packageJsonPaths = fastGlob.sync(globIncludePattern, {
      // const packageJsonPaths = fastGlob.sync('**/package.json', {
      absolute: true,
      ignore,
      cwd,
    });

    logPackageJsonInfo(packageJsonPaths, globIncludePattern, ignore);

    return packageJsonPaths;
  } catch (error) {
    /* prettier-ignore */ console.log('TCL: getPackageJsonPaths -> error', error);
    return [];
  }
}

function logFoundAureliaProjects(aureliaProjects: IAureliaProject[]) {
  /* prettier-ignore */ logger.log(`Found ${aureliaProjects.length} Aurelia project(s) in: `, { logLevel: 'INFO' });
  aureliaProjects.forEach(({ tsConfigPath }) => {
    /* prettier-ignore */ logger.log(`  ${tsConfigPath}`, { logLevel: 'INFO' });
  });
}

function logHasNoAureliaProject() {
  /* prettier-ignore */ logger.log('No active Aurelia project found.', { logLevel: 'INFO' });
  /* prettier-ignore */ logger.log('  Extension will activate, as soon as a file inside an Aurelia project is opened.', { logLevel: 'INFO' });
  /* prettier-ignore */ logger.log('  Or execute command "Aurelia: Reload Extension", if nothing happens.', { logLevel: 'INFO' });
}

function logPackageJsonInfo(
  packageJsonPaths: string[],
  globIncludePattern: string[],
  ignore: string[]
) {
  if (globIncludePattern.length === 0) {
    /* prettier-ignore */ logger.log(`Did not found a package.json file. Searched in: ${globIncludePattern.join(', ')} `, { logLevel: 'INFO' });
  } else {
    /* prettier-ignore */ logger.log(`Found ${packageJsonPaths.length} package.json file(s):`, { logLevel: 'INFO' });
    /* prettier-ignore */ logger.log(`  ${packageJsonPaths.join(', ')}`, { logLevel: 'INFO' });
    /* prettier-ignore */ logger.log(`  Searched in: ${globIncludePattern.join(', ')}`, { logLevel: 'INFO' });
  }
  /* prettier-ignore */ logger.log(`  Excluded: ${ignore.join(', ')}`, { logLevel: 'INFO' });
}

/**
 * Document changes -> version > 1.
 */
function hasDocumentChanged({ version }: TextDocument): boolean {
  return version > 1;
}
