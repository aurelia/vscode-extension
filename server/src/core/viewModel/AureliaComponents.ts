import * as Path from 'path';

import { ts } from '@ts-morph/common';

import { Logger } from '../../common/logging/logger';
import { IAureliaBindable, IAureliaComponent } from './AureliaProgram';
import { getAureliaComponentInfoFromClassDeclaration } from './getAureliaComponentList';

const logger = new Logger('aurelia-components');

export class AureliaComponents {
  private components: IAureliaComponent[] = [];
  private bindables: IAureliaBindable[] = [];

  public init(program: ts.Program, filePaths: string[]): void {
    if (filePaths.length === 0) {
      logger.log('Error: No Aurelia files found.');
    }

    const componentList: IAureliaComponent[] = [];
    const checker = program.getTypeChecker();

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
            checker
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

  public get(): IAureliaComponent[] {
    if (this.components.length === 0) {
      logger.log('Error: No Aurelia components found.');
    }

    return this.components;
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
