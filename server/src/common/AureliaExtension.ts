import { inject } from 'aurelia-dependency-injection';
import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import { fileURLToPath } from 'url';

import { DocumentSettings } from '../configuration/DocumentSettings';
import { AureliaProgram } from '../viewModel/AureliaProgram';
import { createAureliaWatchProgram } from '../viewModel/createAureliaWatchProgram';
import { IProjectOptions, defaultProjectOptions } from './common.types';
import { TextDocument } from 'vscode-languageserver-textdocument';

interface AureliaProject {
  tsConfigPath: string;
  aureliaProgram: AureliaProgram | null;
}

function isAureliaProjectBasedOnPackageJson(packageJsonPath: string) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const dep = packageJson['dependencies'];
  const devDep = packageJson['devDependencies'];

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
export function getAureliaProjectPaths(
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

@inject(DocumentSettings)
export class AureliaExtension {
  aureliaProjectList: AureliaProject[] = [];
  // aureliaProjectMap: Map<string, any> = new Map();

  public constructor(private readonly documentSettings: DocumentSettings) {}

  public async gatherProjectInfo() {}

  public async setAureliaProjectList(packageJsonPaths: string[]) {
    const aureliaProjectPaths = getAureliaProjectPaths(packageJsonPaths);

    aureliaProjectPaths.forEach((aureliaProjectPath) => {
      const filePaths = this.getProjectFilePaths({
        ...this.documentSettings.getSettings().aureliaProject,
        rootDirectory: aureliaProjectPath,
      });

      if (filePaths.length === 0) {
        console.log(
          `[INFO][AuExt.ts] Not including path ${aureliaProjectPath}, because it was excluded or not included.`
        );
        return;
      }
      this.aureliaProjectList.push({
        tsConfigPath: aureliaProjectPath,
        aureliaProgram: null,
      });
    });
  }

  public getAureliaProjectList(): AureliaExtension['aureliaProjectList'] {
    return this.aureliaProjectList;
  }

  /** Copied from AureliaProgram#~ */
  public getProjectFilePaths(
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

  public async hydrateAureliaProjectList(documentsPaths: string[]) {
    /** TODO: Makes esnse? */
    if (documentsPaths.length === 0) return;

    const aureliaProjectList = this.getAureliaProjectList();
    aureliaProjectList; /* ? */
    const settings = await this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;

    // 1. To each map assign a separate program
    /** TODO rename: tsConfigPath -> projectPath (or sth else) */
    documentsPaths; /* ? */
    aureliaProjectList.forEach(async ({ tsConfigPath, aureliaProgram }) => {
      tsConfigPath; /* ? */
      const shouldActive = documentsPaths.some((docPath) => {
        const result = docPath.includes(tsConfigPath);
        return result;
      });
      if (!shouldActive) return;

      /* prettier-ignore */ console.log('TCL: AureliaExtension -> hydrateAureliaProjectList -> tsConfigPath', tsConfigPath);
      if (aureliaProgram !== null) {
        console.log('[WARNING] Found a value, but should be null.');
      }

      aureliaProgram = new AureliaProgram();
      const projectOptions = {
        ...aureliaProjectSettings,
        rootDirectory: tsConfigPath,
      };

      // const paths = aureliaProgram.setProjectFilePaths(projectOptions);
      // if (paths.length === 0) {
      //   console.log(`[INFO][AuExt.ts] Removing path ${tsConfigPath}, because it was excluded or not included`)
      //   aureliaProjectMap.delete(tsConfigPath)
      //   return;
      // }
      await createAureliaWatchProgram(aureliaProgram, {
        ...settings,
        aureliaProject: projectOptions,
      });

      const targetAureliaProject = aureliaProjectList.find(
        (auP) => auP.tsConfigPath === tsConfigPath
      );

      if (!targetAureliaProject) return;

      targetAureliaProject.aureliaProgram = aureliaProgram;
    });

    const aureliaProjectList1 = this.getAureliaProjectList();
    aureliaProjectList1; /* ? */
  }
}