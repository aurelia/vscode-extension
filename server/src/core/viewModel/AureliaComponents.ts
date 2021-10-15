import * as Path from 'path';

import { ts } from '@ts-morph/common';

import { Logger } from '../../common/logging/logger';
import { IAureliaBindable, IAureliaComponent } from './AureliaProgram';
import { getAureliaComponentInfoFromClassDeclaration } from './getAureliaComponentList';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { UriUtils } from '../../common/view/uri-utils';
import { Project } from 'ts-morph';

const logger = new Logger('aurelia-components');

export class AureliaComponents {
  private components: IAureliaComponent[] = [];
  private bindables: IAureliaBindable[] = [];
  checker: ts.TypeChecker;

  public init(program: ts.Program, filePaths: string[]): void {
    if (filePaths.length === 0) {
      logger.log('Error: No Aurelia files found.');
    }

    const componentList: IAureliaComponent[] = [];
    if (!this.checker) {
      this.checker = program.getTypeChecker();
    }

    filePaths.forEach((path) => {
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
            this.checker
          );

          if (!componentInfo) return;

          componentList.push(componentInfo);

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

    this.set(componentList);
    this.setBindables(componentList);

    this.logInfoAboutComponents(componentList);
  }

  public set(components: IAureliaComponent[]): void {
    this.components = components;
  }

  public getAll(): IAureliaComponent[] {
    if (this.components.length === 0) {
      logger.log('Error: No Aurelia components found.');
    }

    return this.components;
  }

  public getOneBy<
    T extends keyof IAureliaComponent,
    Value extends IAureliaComponent[T]
  >(key: T, targetValue: Value): IAureliaComponent | undefined {
    const target = this.getAll().find(
      (component) => component[key] === targetValue
    );
    return target;
  }

  public getIndexBy<
    T extends keyof IAureliaComponent,
    Value extends IAureliaComponent[T]
  >(key: T, targetValue: Value): number {
    const target = this.getAll().findIndex(
      (component) => component[key] === targetValue
    );
    return target;
  }

  /**
   * Parse current state of source file, and assign to components.
   */
  public updateOne(project: Project, document: TextDocument): void {
    const sourceFilePath = UriUtils.toPath(document.uri);
    const sourceFile = project.getSourceFile(sourceFilePath);
    if (!sourceFile) return;

    const updatedText = document.getText();
    const updatedSourceFile = project.createSourceFile(
      sourceFilePath,
      updatedText,
      { overwrite: true }
    );

    const componentInfo = getAureliaComponentInfoFromClassDeclaration(
      updatedSourceFile.compilerNode,
      project.getTypeChecker().compilerObject
    );
    if (!componentInfo) return;

    let targetIndex = this.getIndexBy(
      'viewModelFilePath',
      UriUtils.toPath(document.uri)
    );

    this.components[targetIndex] = componentInfo;
  }

  public setBindables(components: IAureliaComponent[]): void {
    const bindableList: IAureliaBindable[] = [];
    components.forEach((component) => {
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
    this.bindables = bindableList;
  }

  public getBindables(): IAureliaBindable[] {
    return this.bindables;
  }

  private logInfoAboutComponents(components: IAureliaComponent[]) {
    if (components.length) {
      /* prettier-ignore */ logger.culogger.debug([`>>> The extension found this many components: ${components.length}`,], { logLevel: 'INFO' });

      if (components.length < 10) {
        logger.culogger.debug(['List: '], { logLevel: 'INFO' });

        components.forEach((component, index) => {
          /* prettier-ignore */ logger.culogger.debug([`${index} - ${component.viewModelFilePath}`], { logLevel: 'INFO', });
        });
      }
    } else {
      logger.log('[WARNING]: No components found');
    }
  }
}
