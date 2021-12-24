import * as fs from 'fs';
import * as nodePath from 'path';

import * as fastGlob from 'fast-glob';
import { ts } from 'ts-morph';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Logger } from '../common/logging/logger';
import { UriUtils } from '../common/view/uri-utils';
import {
  DocumentSettings,
  ExtensionSettings,
  IAureliaProjectSetting,
} from '../feature/configuration/DocumentSettings';
import { AureliaProgram } from './viewModel/AureliaProgram';

const logger = new Logger('AureliaProject');

const compilerObjectMap = new Map<string, ts.Program | undefined>();

export interface IAureliaProject {
  tsConfigPath: string;
  aureliaProgram: AureliaProgram | null;
}

export class AureliaProjects {
  private aureliaProjects: IAureliaProject[] = [];

  constructor(public readonly documentSettings: DocumentSettings) {}

  public async initAndVerify(extensionSettings: ExtensionSettings) {
    const packageJsonPaths = getPackageJsonPaths(extensionSettings);
    await this.initAndSet(packageJsonPaths);
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
    const documentsPaths = documents.map((document) => {
      const result = UriUtils.toSysPath(document.uri);
      return result;
    });
    if (documentsPaths.length === 0) {
      /* prettier-ignore */ logger.log('(!) Extension not activated.', { logLevel: 'INFO' });
      /* prettier-ignore */ logger.log('(!) Waiting until .html, .js, or .ts file focused.', { logLevel: 'INFO' });
      /* prettier-ignore */ logger.log('    (For performance reasons)', { logLevel: 'INFO' });
      return false;
    }

    const settings = this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;

    // 1. To each map assign a separate program
    await this.addAureliaProgramToEachProject(
      documentsPaths,
      aureliaProjectSettings,
      forceReinit
    );

    return true;
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

  public updateManyView(documents: TextDocument[]) {
    documents.forEach((document) => {
      const targetProject = this.getAll().find((project) =>
        document.uri.includes(project.tsConfigPath)
      );

      const aureliaProgram = targetProject?.aureliaProgram;
      if (!aureliaProgram) return;

      aureliaProgram.aureliaComponents.updateOneView(document);
    });
  }

  private async initAndSet(packageJsonPaths: string[]) {
    this.resetAureliaProjects();

    const aureliaProjectPaths = getAureliaProjectPaths(packageJsonPaths);

    aureliaProjectPaths.forEach((aureliaProjectPath) => {
      const alreadyHasProject = this.aureliaProjects.find(
        (project) => project.tsConfigPath === aureliaProjectPath
      );

      if (alreadyHasProject) {
        return;
      }

      this.aureliaProjects.push({
        tsConfigPath: UriUtils.toSysPath(aureliaProjectPath),
        aureliaProgram: null,
      });
    });
  }

  private async addAureliaProgramToEachProject(
    documentsPaths: string[],
    aureliaProjectSettings: IAureliaProjectSetting | undefined,
    forceReinit: boolean = false
  ) {
    const aureliaProjects = this.getAll();

    /** TODO rename: tsConfigPath -> projectPath (or sth else) */
    aureliaProjects.every(async ({ tsConfigPath, aureliaProgram }) => {
      const shouldActivate = getShouldActivate(documentsPaths, tsConfigPath);
      if (!shouldActivate) return;

      const shouldHydration = aureliaProgram === null || forceReinit;
      if (shouldHydration) {
        const extensionSettings =
          this.documentSettings.getSettings().aureliaProject;
        this.documentSettings.setSettings({
          ...extensionSettings,
          aureliaProject: {
            projectDirectory: tsConfigPath,
          },
        });
        aureliaProgram = new AureliaProgram(this.documentSettings);
        const tsMorphProject = aureliaProgram.tsMorphProject.create();

        let compilerObject = compilerObjectMap.get(tsConfigPath);
        if (compilerObject == null || forceReinit) {
          const program = tsMorphProject.getProgram();
          // [PERF]: 1.87967675s
          compilerObject = program.compilerObject;
          compilerObjectMap.set(tsConfigPath, compilerObject);
        }

        if (compilerObject != null) {
          aureliaProgram.setProgram(compilerObject);
        }
      }

      const projectOptions: IAureliaProjectSetting = {
        ...aureliaProjectSettings,
        rootDirectory: tsConfigPath,
      };
      // [PERF]: 0.67967675s
      if (aureliaProgram == null) return;
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

  private resetAureliaProjects(): void {
    this.aureliaProjects = [];
  }
}

function getShouldActivate(documentsPaths: string[], tsConfigPath: string) {
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
    const hasAuInDep = isAuApp || isAuPlugin;
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

  const ignore = [];
  const exclude = aureliaProject?.exclude;
  if (exclude != null) {
    ignore.push(...exclude);
  }
  const packageJsonInclude = aureliaProject?.packageJsonInclude;
  let globIncludePattern = [];
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
    /* prettier-ignore */ console.log('TCL: getPackageJsonPaths -> error', error)
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
  /* prettier-ignore */ logger.log('Extension will activate, as soon as a file inside an Aurelia project is opened.', { logLevel: 'INFO' });
}

function logPackageJsonInfo(
  packageJsonPaths: string[],
  globIncludePattern: string[],
  ignore: string[]
) {
  if (globIncludePattern.length === 0) {
    /* prettier-ignore */ logger.log(`Did not found a package.json file. Searched in: ${globIncludePattern.join(', ')} `, { logLevel: 'INFO' });
  } else {
    /* prettier-ignore */ logger.log(`Found ${packageJsonPaths.length} package.json file(s).`, { logLevel: 'INFO' });
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
