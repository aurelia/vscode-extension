import { pascalCase } from '@aurelia/kernel';
import { Container, inject } from 'aurelia-dependency-injection';
import { Connection, Range, RequestType } from 'vscode-languageserver';
import fs from 'fs';

import {
  AllDocuments,
  GetEditorSelectionResponse,
} from '../../common/types/types';
import { AureliaProjects, IAureliaProject } from '../../core/AureliaProjects';
import {
  AllDocumentsInjection,
  ConnectionInjection,
} from '../../core/depdencenyInjection';
import {
  getEditorSelection,
  WorkspaceUpdates,
} from '../../common/client/client';
import { RegionService } from '../../common/services/RegionService';
import { AbstractRegion } from '../../aot/parser/regions/ViewRegions';
import { TextDocument, TextEdit } from 'vscode-languageserver-textdocument';
import { kebabCase } from 'lodash';

@inject(Container, ConnectionInjection, AllDocumentsInjection, AureliaProjects)
export class ExtractComponent {
  constructor(
    private container: Container,
    private connection: Connection,
    private allDocuments: AllDocuments,
    private aureliaProjects: AureliaProjects
  ) {}

  async initExtractComponent() {
    // const componentName = await getComponentName(connection);
    const componentName = 'hello-world';
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

    const collectedScopeNames = this.getAccessScopeNames(
      targetProject,
      getEditorSelectionResponse
    );
    if (!collectedScopeNames) return;

    // 3. create files
    this.createComponent(
      targetProject,
      getEditorSelectionResponse,
      componentName,
      selectedTexts,
      collectedScopeNames
    );

    // 4. Replace selection with new component
    await this.replaceSelection(
      componentName,
      getEditorSelectionResponse,
      collectedScopeNames
    );
  }

  private async replaceSelection(
    componentName: string,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    collectedScopeNames: string[]
  ) {
    const { documentUri, selections } = getEditorSelectionResponse;
    const document = this.allDocuments.get(documentUri);
    if (!document) return;
    const workspaceUpdates = new WorkspaceUpdates();

    for (const selection of selections) {
      const attributes = collectedScopeNames
        .map((name) => `${name}.bind="${name}"`)
        .join(' ');
      const toTagName = kebabCase(componentName);
      const withTags = `<${toTagName}\n  ${attributes}>\n</${toTagName}>`;
      const importTag = `<require from=''></require>`
      const withImports = `${importTag}\n${withTags}`
      workspaceUpdates.replaceText(
        documentUri,
        withImports,
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character
      );
      await workspaceUpdates.applyChanges();
    }
  }

  private createComponent(
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    componentName: string,
    selectedTexts: string[],
    collectedScopeNames: string[]
  ) {
    const creationPath = `${targetProject?.tsConfigPath}/src/${componentName}`;
    if (!fs.existsSync(creationPath)) {
      fs.mkdirSync(creationPath);
    }

    this.createViewModelFile(creationPath, componentName, collectedScopeNames);
    this.createViewFile(
      creationPath,
      componentName,
      targetProject,
      getEditorSelectionResponse,
      selectedTexts
    );
  }

  private createViewModelFile(
    creationPath: string,
    componentName: string,
    collectedScopeNames: string[]
  ) {
    const viewModelExt = '.ts';
    const viewModelPath = `${creationPath}/${componentName}${viewModelExt}`;
    const className = pascalCase(componentName);

    const asBindablesCode = Array.from(collectedScopeNames)
      .map((name) => `@bindable ${name};`)
      .join('\n  ');

    const finalContent = `import { bindable } from 'aurelia-framework';

export class ${className} {
  ${asBindablesCode}
}
`;
    fs.writeFileSync(viewModelPath, finalContent);
  }

  private createViewFile(
    creationPath: string,
    componentName: string,
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    selectedTexts: string[]
  ) {
    const viewExt = '.html';
    const viewPath = `${creationPath}/${componentName}${viewExt}`;

    const content = selectedTexts.join('\n');
    const finalContent = `<template>\n  ${content}\n</template>`;
    fs.writeFileSync(viewPath, finalContent);
  }

  private async getComponentName() {
    const req = new RequestType('get-component-name');
    this.connection.sendRequest(req);
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

  private getAccessScopeNames(
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse
  ) {
    const { documentPath, documentUri, selections } =
      getEditorSelectionResponse;

    const component = targetProject?.aureliaProgram?.aureliaComponents.getOneBy(
      'viewFilePath',
      documentPath
    );
    if (!component) return;
    const document = this.allDocuments.get(documentUri);
    if (!document) return;

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

    return Array.from(collectedScopeNames);
  }
}