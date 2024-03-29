import 'reflect-metadata';

import { ts } from 'ts-morph';

import { UriUtils } from '../common/view/uri-utils';
import {
  defaultProjectOptions,
  DocumentSettings,
  IAureliaProjectSetting,
} from '../configuration/DocumentSettings';
import { AureliaComponents } from './AureliaComponents';
import { TsMorphProject } from './tsMorph/AureliaTsMorph';

// const logger = new Logger('AureliaProgram');

/**
 * The AureliaProgram class represents your whole applicaton
 * (aka. program in typescript terminology)
 */
export class AureliaProgram {
  public aureliaComponents: AureliaComponents;
  public tsMorphProject: TsMorphProject;

  private builderProgram: ts.Program;
  private aureliaSourceFiles?: ts.SourceFile[] | undefined;
  private filePaths: string[] = [];

  constructor(public readonly documentSettings: DocumentSettings) {
    // /* prettier-ignore */ console.log('TCL: AureliaProgram -> constructor -> constructor')
    this.aureliaComponents = new AureliaComponents(documentSettings);
    this.tsMorphProject = new TsMorphProject(documentSettings);
  }

  public initAureliaComponents(projectOptions: IAureliaProjectSetting): void {
    this.determineFilePaths(projectOptions);

    this.aureliaComponents.init(this.tsMorphProject.get(), this.getFilePaths());
  }

  /**
   * getProgram gets the current program
   *
   * The program may be undefined if no watcher is present or no program has been initiated yet.
   *
   * This program can change from each call as the program is fetched
   * from the watcher which will listen to IO changes in the tsconfig.
   */
  public getProgram(): ts.Program {
    if (this.builderProgram === undefined) {
      throw new Error('No Program');
    }
    return this.builderProgram;
  }

  public setProgram(program: ts.Program): void {
    this.builderProgram = program;
    this.initAureliaSourceFiles(this.builderProgram);
  }

  /**
   * Get aurelia source files
   */
  public getAureliaSourceFiles(): ts.SourceFile[] | undefined {
    if (this.aureliaSourceFiles) return this.aureliaSourceFiles;

    this.initAureliaSourceFiles(this.builderProgram);
    return this.aureliaSourceFiles;
  }

  /**
   * Only update aurelia source files with relevant source files
   */
  private initAureliaSourceFiles(builderProgram: ts.Program): void {
    // [PERF]: ~0.6s
    const sourceFiles = builderProgram.getSourceFiles();
    this.aureliaSourceFiles = sourceFiles?.filter((sourceFile) => {
      const isNodeModules = sourceFile.fileName.includes('node_modules');
      return !isNodeModules;
    });
  }

  private getFilePaths(): string[] {
    return this.filePaths;
  }

  private determineFilePaths(projectOptions: IAureliaProjectSetting): void {
    if (projectOptions.rootDirectory !== undefined) {
      this.filePaths = getUserConfiguredFilePaths(projectOptions);
      return;
    }

    const sourceFiles = this.getAureliaSourceFiles();
    if (!sourceFiles) return;
    const filePaths = sourceFiles.map((file) =>
      UriUtils.toSysPath(file.fileName)
    );
    if (filePaths === undefined) return;
    this.filePaths = filePaths;
  }
}

function getUserConfiguredFilePaths(
  options: IAureliaProjectSetting = defaultProjectOptions
): string[] {
  const { rootDirectory, exclude, include } = options;
  const targetSourceDirectory = rootDirectory ?? ts.sys.getCurrentDirectory();
  const finalExcludes = getFinalExcludes(exclude);
  const finalIncludes = getFinalIncludes(include);
  const sysPath = UriUtils.toSysPath(targetSourceDirectory);
  const paths = ts.sys.readDirectory(
    sysPath,
    ['ts', 'js'],
    // ['ts', 'js', 'html'],
    finalExcludes,
    finalIncludes
  );

  return paths;
}

function getFinalIncludes(include: string[] | undefined) {
  let finalIncludes: string[];

  if (include !== undefined) {
    finalIncludes = include;
  } else {
    finalIncludes = ['src'];
  }
  return finalIncludes;
}

function getFinalExcludes(exclude: string[] | undefined) {
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
  return finalExcludes;
}
