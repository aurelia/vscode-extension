import 'reflect-metadata';
import * as Path from 'path';

import { ts } from 'ts-morph';

import { defaultProjectOptions, IProjectOptions } from '../common/common.types';
import { AureliaClassTypes } from '../common/constants';
import { Logger } from '../common/logging/logger';
import { ViewRegionInfo } from '../feature/embeddedLanguages/embeddedSupport';
import { getAureliaComponentInfoFromClassDeclaration } from './getAureliaComponentList';

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
  public builderProgram: ts.Program;
  public aureliaSourceFiles?: ts.SourceFile[];
  public projectFilePaths: string[];
  private componentList: IAureliaComponent[];
  private bindableList: IAureliaBindable[];

  public initComponentList(): IAureliaComponent[] | undefined {
    const componentList: IAureliaComponent[] = [];

    const program = this.getProgram();
    if (program === undefined) {
      console.log('No Program associated with your Aurelia project.');
      return;
    }
    // [PERF]: ~0.6s
    const checker = program.getTypeChecker();

    this.projectFilePaths.forEach((path) => {
      const isDTs = Path.basename(path).endsWith('.d.ts');
      if (isDTs) return;

      const ext = Path.extname(path);
      switch (ext) {
        case '.js':
        case '.ts': {
          const sourceFile = program.getSourceFile(path);
          if (sourceFile === undefined) {
            // console.log(
            //   'These source files are ignored by the extension: ',
            //   path
            // );
            return;
          }

          /* export class MyCustomElement */
          const componentInfo = getAureliaComponentInfoFromClassDeclaration(
            sourceFile,
            checker
          );

          if (componentInfo) {
            componentList.push(componentInfo);
          }

          break;
        }
        case '.html': {
          break;
        }
        default: {
          console.log('Unsupported extension');
        }
      }
    });

    if (componentList.length === 0) {
      console.log('Error: No Aurelia class found');
    }

    this.setComponentList(componentList);
    this.setBindableList(componentList);
  }

  public setComponentList(componentList: IAureliaComponent[]): void {
    this.componentList = componentList;
  }

  public getComponentList(): IAureliaComponent[] {
    return this.componentList;
  }

  public updateAureliaComponents = (projectOptions?: IProjectOptions): void => {
    this.initTheProjectsFilePaths(projectOptions);

    this.initComponentList();
    const componentList = this.getComponentList();

    if (componentList.length) {
      this.setComponentList(componentList);
      /* prettier-ignore */ logger.culogger.debug([ `>>> The extension found this many components: ${componentList.length}`, ], { logLevel: 'INFO' });

      if (componentList.length < 10) {
        logger.culogger.debug(['List: '], { logLevel: 'INFO' });

        componentList.forEach((component, index) => {
          /* prettier-ignore */ logger.culogger.debug([`${index} - ${component.viewModelFilePath}`], { logLevel: 'INFO', });
        });
      }
    } else {
      console.log('[WARNING]: No components found');
    }
  };

  public setBindableList(componentList: IAureliaComponent[]): void {
    const bindableList: IAureliaBindable[] = [];
    componentList.forEach((component) => {
      component.classMembers?.forEach((classMember) => {
        if (classMember.isBindable) {
          if (component.componentName === undefined) return;

          const targetBindable: IAureliaBindable = {
            componentName: component.componentName,
            classMember,
          };
          bindableList.push(targetBindable);
        }
      });
    });
    this.bindableList = bindableList;
  }

  public getBindableList(): IAureliaBindable[] {
    return this.bindableList;
  }

  public setViewRegions(
    componentName: string,
    newRegions: ViewRegionInfo[]
  ): void {
    const componentList = this.getComponentList();
    const targetComponent = componentList.find(
      (component) => component.componentName === componentName
    );

    if (!targetComponent) return;

    targetComponent.viewRegions = newRegions;
  }

  public initTheProjectsFilePaths(
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

    let finalIncludes: string[];

    if (include !== undefined) {
      finalIncludes = include;
    } else {
      finalIncludes = ['src'];
    }

    const paths = ts.sys.readDirectory(
      targetSourceDirectory,
      ['ts'],
      // ['ts', 'js', 'html'],
      finalExcludes,
      finalIncludes
    );

    this.projectFilePaths = paths;
    return paths;
  }

  public getProjectFilePaths(): string[] {
    return this.projectFilePaths;
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

  public setBuilderProgram(builderProgram: ts.Program): void {
    this.builderProgram = builderProgram;
    this.updateAureliaSourceFiles(this.builderProgram);
  }

  /**
   * Only update aurelia source files with relevant source files
   */
  public updateAureliaSourceFiles(builderProgram: ts.Program): void {
    const sourceFiles = builderProgram.getSourceFiles();
    this.aureliaSourceFiles = sourceFiles?.filter((sourceFile) => {
      if (sourceFile.fileName.includes('node_modules')) return false;
      return sourceFile;
    });
  }

  /**
   * Get aurelia source files
   */
  public getAureliaSourceFiles(): ts.SourceFile[] | undefined {
    if (this.aureliaSourceFiles) return this.aureliaSourceFiles;

    this.updateAureliaSourceFiles(this.builderProgram);
    return this.aureliaSourceFiles;
  }
}
