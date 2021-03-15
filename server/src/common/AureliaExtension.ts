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

export function getAureliaProjectPaths(
  packageJsonPaths: string[],
  activeDocuments: TextDocument[] = []
) {
  const aureliaProjectsRaw = packageJsonPaths.filter((packageJsonPath) => {
    const isAu = isAureliaProjectBasedOnPackageJson(packageJsonPath);
    return isAu;
  });

  const activeDocumentPaths = activeDocuments.map((activeDocument) => {
    const documentPath = fileURLToPath(path.normalize(activeDocument.uri));
    return documentPath;
  });

  let aureliaProjectPaths = aureliaProjectsRaw.map((aureliaProject) => {
    const dirName = path.dirname(aureliaProject);
    return dirName;
  });
  aureliaProjectPaths = aureliaProjectPaths.filter((aureliaProjectPath) => {
    const isOpen = activeDocumentPaths.some((activeDocumentPath) => {
      const isProject = activeDocumentPath.includes(aureliaProjectPath);
      return isProject;
    });
    return isOpen;
  });

  return aureliaProjectPaths;
}

@inject(DocumentSettings)
export class AureliaExtension {
  aureliaProjectMap: Map<string, AureliaProgram | null> = new Map();
  // aureliaProjectMap: Map<string, any> = new Map();

  public constructor(private readonly documentSettings: DocumentSettings) {}

  public async setAureliaProjectMap(
    packageJsonPaths: string[],
    activeDocuments: TextDocument[] = []
  ) {
    const aureliaProjectPaths = getAureliaProjectPaths(
      packageJsonPaths,
      activeDocuments
    );

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
      this.aureliaProjectMap.set(aureliaProjectPath, null);
    });
  }

  public getAureliaProjectMap(): AureliaExtension['aureliaProjectMap'] {
    return this.aureliaProjectMap;
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

  public async hydrateAureliaProjectMap() {
    const aureliaProjectMap = this.getAureliaProjectMap();
    const settings = await this.documentSettings.getSettings();
    const aureliaProjectSettings = settings?.aureliaProject;

    // 1. To each map assign a separate program
    aureliaProjectMap.forEach(async (value, projectPath) => {
      if (value !== null) {
        console.log('[WARNING] Found a value, but should be null.');
      }

      const aureliaProgram = new AureliaProgram();
      const projectOptions = {
        ...aureliaProjectSettings,
        rootDirectory: projectPath,
      };

      // const paths = aureliaProgram.setProjectFilePaths(projectOptions);
      // if (paths.length === 0) {
      //   console.log(`[INFO][AuExt.ts] Removing path ${projectPath}, because it was excluded or not included`)
      //   aureliaProjectMap.delete(projectPath)
      //   return;
      // }
      await createAureliaWatchProgram(aureliaProgram, {
        ...settings,
        aureliaProject: projectOptions,
      });

      aureliaProjectMap.set(projectPath, aureliaProgram);
    });
  }
}
