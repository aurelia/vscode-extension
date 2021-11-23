import * as Path from 'path';

import { ts } from '@ts-morph/common';
import { Project } from 'ts-morph';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { defaultLogger, Logger } from '../../common/logging/logger';
import { UriUtils } from '../../common/view/uri-utils';
import { DocumentSettings } from '../../feature/configuration/DocumentSettings';
import { RegionParser } from '../regions/RegionParser';
import { Optional } from '../regions/ViewRegions';
import { IAureliaBindable, IAureliaComponent } from './AureliaProgram';
import { getAureliaComponentInfoFromClassDeclaration } from './getAureliaComponentList';

const logger = new Logger('AureliaComponents');

export class AureliaComponents {
  private components: IAureliaComponent[] = [];
  private bindables: IAureliaBindable[] = [];
  private checker: ts.TypeChecker;

  constructor(public readonly documentSettings: DocumentSettings) {}

  public init(program: ts.Program, filePaths: string[]): void {
    if (filePaths.length === 0) {
      logger.log('Error: No Aurelia files found.');
      return;
    }
    if (this.checker === undefined) {
      this.checker = program.getTypeChecker();
    }

    const componentListWithoutRegions: Optional<
      IAureliaComponent,
      'viewRegions'
    >[] = [];

    filePaths.forEach((path) => {
      if (path == null) return;

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
          componentListWithoutRegions.push(componentInfo);

          break;
        }
        case '.html': {
          break;
        }
        default: {
          logger.log(`Unsupported extension: ${ext}`);
        }
      }
    });

    const enhanced = this.enhanceWithViewRegions(componentListWithoutRegions);

    logComponentList(enhanced);

    this.set(enhanced);
    this.setBindables(enhanced);

    this.logInfoAboutComponents(enhanced);
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

  public getOneByFromDocument(document: TextDocument) {
    document.uri; /*?*/
    defaultLogger.stack();
    const target = this.getAll().find((component) => {
      if (this.isViewDocument(document)) {
        if (component.viewFilePath === undefined) return false;
        if (component.viewFilePath !== UriUtils.toSysPath(document.uri))
          return false;
        return this.getOneBy(
          'viewFilePath',
          UriUtils.toSysPath(component.viewFilePath)
        );
      } else if (this.isViewModelDocument(document)) {
        if (component.viewModelFilePath !== UriUtils.toSysPath(document.uri))
          return false;
        return this.getOneBy(
          'viewModelFilePath',
          UriUtils.toSysPath(component.viewModelFilePath)
        );
      }

      return false;
    });

    return target;
  }

  private isViewDocument(document: TextDocument) {
    const viewExtensions =
      this.documentSettings.getSettings().relatedFiles?.view;
    if (!viewExtensions) return;

    const target = viewExtensions.find((extension) =>
      document.uri.endsWith(extension)
    );
    return target;
  }

  private isViewModelDocument(document: TextDocument) {
    const viewModelExtensions =
      this.documentSettings.getSettings().relatedFiles?.script;
    if (!viewModelExtensions) return;

    const target = viewModelExtensions.find((extension) =>
      document.uri.endsWith(extension)
    );
    return target;
  }

  /**
   * Note: Difference to #getOneBy.
   *   Could relate to pointer to object.
   */
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
    const sourceFilePath = UriUtils.toSysPath(document.uri);
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

    const targetIndex = this.getIndexBy(
      'viewModelFilePath',
      UriUtils.toSysPath(document.uri)
    );

    this.components[targetIndex] = {
      ...this.components[targetIndex],
      ...componentInfo,
    };
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

  private enhanceWithViewRegions(
    componentList: Optional<IAureliaComponent, 'viewRegions'>[]
  ) {
    const enhanced = [...componentList];
    enhanced.forEach((component) => {
      if (component.viewFilePath === undefined) return;
      const viewDocument = TextDocumentUtils.createHtmlFromPath(
        component.viewFilePath
      );
      const regions = RegionParser.parse(viewDocument, componentList);
      component.viewRegions = regions;
    });

    return enhanced as IAureliaComponent[];
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
function logComponentList(components: IAureliaComponent[]) {
  logger.log(`Found ${components.length} Components.`);
}
