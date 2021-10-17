import 'reflect-metadata';

import { Project, ts } from 'ts-morph';

import { AureliaClassTypes } from '../../common/constants';
import { Logger } from '../../common/logging/logger';
import {
  defaultProjectOptions,
  IAureliaProjectSetting,
} from '../../feature/configuration/DocumentSettings';
import { ViewRegionInfo } from '../embeddedLanguages/embeddedSupport';
import { AureliaComponents } from './AureliaComponents';

const logger = new Logger('AureliaProgram');

export interface IAureliaClassMember {
  name: string;
  documentation: string;
  isBindable: boolean;
  syntaxKind: ts.SyntaxKind;
}

export interface IAureliaComponent {
  documentation: string;
  sourceFile?: ts.SourceFile;
  version?: number;
  /** export class >ComponentName< {} */
  className: string;
  /** component-name */
  baseViewModelFileName: string;
  /** path/to/component-name.ts */
  viewModelFilePath: string;
  /**
   * export class >Sort<ValueConverter {} --> sort
   * */
  valueConverterName?: string;
  /**
   * \@customElement(">component-name<")
   * export class >ComponentName< {} --> component-name
   * */
  componentName?: string;
  decoratorComponentName?: string;
  decoratorStartOffset?: number;
  decoratorEndOffset?: number;
  viewFilePath?: string;
  type: AureliaClassTypes;
  /** ******** Class Members */
  classMembers?: IAureliaClassMember[];
  /** ******** View */
  viewRegions?: ViewRegionInfo[];
}

export interface IAureliaBindable {
  componentName: string;
  /**
   * Class member information of bindable.
   *
   * Reason for structure:
   * Before, the interface was like `export interface IAureliaBindable extends IAureliaClassMember`,
   * but due to further processing hardship (creating actual CompletionItem), that interface was hard to work with.
   */
  classMember: IAureliaClassMember;
}

/**
 * The AureliaProgram class represents your whole applicaton
 * (aka. program in typescript terminology)
 */
export class AureliaProgram {
  public aureliaComponents: AureliaComponents;

  private builderProgram: ts.Program;
  private aureliaSourceFiles?: ts.SourceFile[] | undefined;
  private filePaths: string[] = [];
  private tsMorphProject: Project;

  constructor() {
    /* prettier-ignore */ console.log('TCL: AureliaProgram -> constructor -> constructor')
    this.aureliaComponents = new AureliaComponents();
  }

  public initAureliaComponents(projectOptions: IAureliaProjectSetting): void {
    const program = this.getProgram();
    this.determineFilePaths(projectOptions);
    const filePaths = this.getFilePaths();

    this.aureliaComponents.init(program, filePaths);
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
    if (!this.builderProgram) {
      throw new Error('No Program');
    }
    return this.builderProgram;
  }

  public setProgram(program: ts.Program): void {
    this.builderProgram = program;
    this.initAureliaSourceFiles(this.builderProgram);
  }

  public getTsMorphProject() {
    return this.tsMorphProject;
  }

  public setTsMorphProject(tsMorphProject: Project) {
    this.tsMorphProject = tsMorphProject;
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
    if (projectOptions.rootDirectory) {
      this.filePaths = getUserConfiguredFilePaths(projectOptions);
      return;
    }

    const sourceFiles = this.getAureliaSourceFiles();
    if (!sourceFiles) return;
    const filePaths = sourceFiles.map((file) => file.fileName);
    if (!filePaths) return;
    this.filePaths = filePaths;
  }
}

function getUserConfiguredFilePaths(
  options: IAureliaProjectSetting = defaultProjectOptions
): string[] {
  const { rootDirectory, exclude, include } = options;
  const targetSourceDirectory = rootDirectory || ts.sys.getCurrentDirectory();
  const finalExcludes = getFinalExcludes(exclude);
  const finalIncludes = getFinalIncludes(include);
  const paths = ts.sys.readDirectory(
    targetSourceDirectory,
    ['ts'],
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
