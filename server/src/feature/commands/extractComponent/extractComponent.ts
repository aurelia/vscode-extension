import { pascalCase } from '@aurelia/kernel';
import { Container, inject } from 'aurelia-dependency-injection';
import { Connection, Range, RequestType } from 'vscode-languageserver';
import fs from 'fs';

import {
  AllDocuments,
  GetEditorSelectionResponse,
  UserSuppliedTemplatesFunctions,
} from '../../../common/types/types';
import {
  AureliaProjects,
  IAureliaProject,
} from '../../../core/AureliaProjects';
import {
  AllDocumentsInjection,
  ConnectionInjection,
} from '../../../core/depdencenyInjection';
import {
  getEditorSelection,
  WorkspaceUpdates,
} from '../../../common/client/client';
import { RegionService } from '../../../common/services/RegionService';
import { AbstractRegion } from '../../../aot/parser/regions/ViewRegions';
import { kebabCase } from 'lodash';
import { AureliaUtils } from '../../../common/AureliaUtils';
import { IAureliaClassMember } from '../../../aot/aotTypes';
import { UriUtils } from '../../../common/view/uri-utils';

const getComponentNameRequest = new RequestType('get-component-name');

export class ExtractComponent {
  private workspaceUpdates: WorkspaceUpdates;

  constructor(
    private container: Container,
    private connection: Connection,
    private allDocuments: AllDocuments,
    private aureliaProjects: AureliaProjects
  ) {}

  public async executeExtractComponent() {
    await this.perfom();
    await this.workspaceUpdates.applyChanges();
  }

  public async perfom() {
    this.workspaceUpdates = new WorkspaceUpdates();
    const componentName = await this.getComponentName();
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: extractComponent.ts ~ line 7 ~ componentName', componentName)

    // 2. Get Selection
    const getEditorSelectionResponse = await getEditorSelection(
      this.connection
    );
    const selectedTexts = await this.extractSelectedTexts(
      getEditorSelectionResponse
    );
    const targetProject = this.aureliaProjects.getFromUri(
      getEditorSelectionResponse.documentUri
    );
    if (!targetProject) return;

    const collectedClassMembers = this.getClassMembers(
      targetProject,
      getEditorSelectionResponse
    );
    if (!collectedClassMembers) return;

    // 3. create files
    await this.createComponent(
      targetProject,
      getEditorSelectionResponse,
      componentName,
      selectedTexts,
      collectedClassMembers
    );

    // 4. Replace selection with new component
    await this.replaceSelection(
      targetProject,
      componentName,
      getEditorSelectionResponse,
      collectedClassMembers
    );

    const edits = this.workspaceUpdates.getEdits();
    return edits;
  }

  private async replaceSelection(
    targetProject: IAureliaProject,
    componentName: string,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    collectedClassMembers: IAureliaClassMember[]
  ) {
    const { documentUri, selections } = getEditorSelectionResponse;
    const document = this.allDocuments.get(documentUri);
    if (!document) return;
    const isAuV1 = AureliaUtils.isAuV1(targetProject.aureliaVersion);
    const importTagName = isAuV1 ? 'require' : 'import';

    for (const selection of selections) {
      const attributes = collectedClassMembers
        .map((member) => `${member.name}.bind="${member.name}"`)
        .join(' ');
      const toTagName = kebabCase(componentName);
      const withTags = `<${toTagName}\n  ${attributes}>\n</${toTagName}>`;
      const importTag = `<${importTagName} from=''></${importTagName}>`;
      const withImports = `${importTag}\n${withTags}`;
      this.workspaceUpdates.replaceText(
        documentUri,
        withImports,
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character
      );
    }
  }

  private async createComponent(
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    componentName: string,
    selectedTexts: string[],
    collectedClassMembers: IAureliaClassMember[]
  ) {
    const creationPath = `${targetProject?.tsConfigPath}/${componentName}`;
    if (!fs.existsSync(creationPath)) {
      fs.mkdirSync(creationPath);
    }

    const userSuppliedCreateViewModelTemplates =
      await this.getUserSuppliedCreateViewModelTemplate(targetProject);

    await this.createViewModelFile(
      targetProject,
      creationPath,
      componentName,
      collectedClassMembers,
      userSuppliedCreateViewModelTemplates?.createViewModelTemplate
    );
    await this.createViewFile(
      creationPath,
      componentName,
      targetProject,
      getEditorSelectionResponse,
      selectedTexts,
      userSuppliedCreateViewModelTemplates?.createViewTemplate
    );
  }

  private async createViewModelFile(
    targetProject: IAureliaProject,
    creationPath: string,
    componentName: string,
    collectedClassMembers: IAureliaClassMember[],
    createViewModelTemplate: (() => string) | undefined
  ) {
    const viewModelExt = '.ts';
    const viewModelPath = `${creationPath}/${componentName}${viewModelExt}`;
    const className = pascalCase(componentName);
    const asBindablesCode = collectedClassMembers
      .map((member) => {
        const withTypes = member.memberType ? `: ${member.memberType}` : '';
        return `@bindable ${member.name}${withTypes};`;
      })
      .join('\n  ');
    const isAuV1 = AureliaUtils.isAuV1(targetProject.aureliaVersion);
    const bindableImportPackage = isAuV1 ? 'aurelia-framework' : 'aurelia';

    const createFunction = createViewModelTemplate ?? createViewModel;
    const finalContent = createFunction({
      bindableImportPackage,
      className,
      asBindablesCode,
      collectedClassMembers,
    });

    const uri = UriUtils.toVscodeUri(viewModelPath);
    this.workspaceUpdates.createFile(uri, finalContent);
  }

  private async getUserSuppliedCreateViewModelTemplate(
    targetProject: IAureliaProject
  ) {
    const templateFilePath = `${targetProject.tsConfigPath}/.aurelia/extension/templates.js`;
    if (!fs.existsSync(templateFilePath)) {
      return;
    }

    const templateFiles = await import(templateFilePath);
    return templateFiles as UserSuppliedTemplatesFunctions;
  }

  private createViewFile(
    creationPath: string,
    componentName: string,
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    selectedTexts: string[],
    createViewTemplate: (() => string) | undefined
  ) {
    const viewExt = '.html';
    const viewPath = `${creationPath}/${componentName}${viewExt}`;
    const isAuV1 = AureliaUtils.isAuV1(targetProject.aureliaVersion);

    const createFunction = createViewTemplate ?? createView;

    const surroundWithTemplate = createFunction({ selectedTexts, isAuV1 });

    const uri = UriUtils.toVscodeUri(viewPath);
    this.workspaceUpdates.createFile(uri, surroundWithTemplate);
  }

  private async getComponentName() {
    const result = await this.connection.sendRequest(getComponentNameRequest);
    return result as string;
  }

  private extractSelectedTexts(
    getEditorSelectionResponse: GetEditorSelectionResponse
  ) {
    const { documentUri, selections } = getEditorSelectionResponse;
    const document = this.allDocuments.get(documentUri);

    let rawTexts = selections.map((selection) => {
      const range = Range.create(selection.start, selection.end);
      const text = document?.getText(range);
      return text;
    });
    const selectedTexts = rawTexts.filter(
      (text) => text !== undefined
    ) as string[];

    return selectedTexts;
  }

  private getClassMembers(
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse
  ): IAureliaClassMember[] {
    const { documentPath, documentUri, selections } =
      getEditorSelectionResponse;

    const component = targetProject?.aureliaProgram?.aureliaComponents.getOneBy(
      'viewFilePath',
      documentPath
    );
    if (!component) return [];
    const document = this.allDocuments.get(documentUri);
    if (!document) return [];

    // Get Regions from range
    const regions = component.viewRegions;
    let targetRegions: AbstractRegion[] = [];
    selections.forEach((selection) => {
      const range = Range.create(selection.start, selection.end);
      const regionsInRange = RegionService.getManyRegionsInRange(
        regions,
        document,
        range
      );
      targetRegions.push(...regionsInRange);
    });

    // Get AccessScope names from regions
    const collectedScopeNames: Set<string> = new Set();
    targetRegions.forEach((region) => {
      region.accessScopes?.forEach((scope) => {
        collectedScopeNames.add(scope.name);
      });
    });

    const classMembers: IAureliaClassMember[] = [];
    Array.from(collectedScopeNames).forEach((nameInView) => {
      const classMember = component.classMembers?.find(
        (member) => member.name === nameInView
      );
      if (!classMember) return;
      classMembers.push(classMember);
    });

    return classMembers;
  }
}

function createView({
  selectedTexts,
  isAuV1,
}: {
  selectedTexts: string[];
  isAuV1: boolean;
}) {
  const content = selectedTexts.join('\n');
  const surroundWithTemplate = isAuV1
    ? `<template>\n  ${content}\n</template>`
    : content;
  return surroundWithTemplate;
}

function createViewModel({
  bindableImportPackage,
  className,
  asBindablesCode,
  collectedClassMembers,
}: {
  /** Package name from which the bindable decorator is imported from */
  bindableImportPackage: string;
  /** Class name as PascalCase */
  className: string;
  /** All the bindables in the from of: @bindable <name>: <type?> */
  asBindablesCode: string;
  /**
   * Internal data about Class members for the bindable section.
   * Includes eg. docs (if they are available), and other potential interesting information
   */
  collectedClassMembers?: IAureliaClassMember[];
}) {
  return `import { bindable } from '${bindableImportPackage}';

export class ${className} {
  ${asBindablesCode}
}
`;
}
