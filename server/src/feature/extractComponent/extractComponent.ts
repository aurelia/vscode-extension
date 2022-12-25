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
import { getEditorSelection } from '../../common/client/client';
import { RegionService } from '../../common/services/RegionService';
import { RegionParser } from '../../aot/parser/regions/RegionParser';

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

    // 3. create files
    this.createComponent(
      getEditorSelectionResponse,
      componentName,
      selectedTexts
    );
  }

  private createComponent(
    getEditorSelectionResponse: GetEditorSelectionResponse,
    componentName: string,
    selectedTexts: string[]
  ) {
    const targetProject = this.aureliaProjects.getFromUri(
      getEditorSelectionResponse.documentUri
    );
    if (!targetProject) return;

    const creationPath = `${targetProject?.tsConfigPath}/src/${componentName}`;
    if (!fs.existsSync(creationPath)) {
      fs.mkdirSync(creationPath);
    }

    this.createViewModelFile(
      creationPath,
      componentName,
      targetProject,
      getEditorSelectionResponse,
      selectedTexts
    );
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
    targetProject: IAureliaProject,
    getEditorSelectionResponse: GetEditorSelectionResponse,
    selectedTexts: string[]
  ) {
    const viewModelExt = '.ts';
    const viewModelPath = `${creationPath}/${componentName}${viewModelExt}`;
    const className = pascalCase(componentName);

    const component = targetProject?.aureliaProgram?.aureliaComponents.getOneBy(
      'viewFilePath',
      getEditorSelectionResponse.documentPath
    );
    if (!component) return;

    // RegionService.findRegionAtOffset(regions, offset)
    const regions = component.viewRegions;
    const pretty = RegionParser.pretty(regions, {
      asTable: true,
      ignoreKeys: [
        'sourceCodeLocation',
        'languageService',
        'subType',
        'tagName',
      ],
      maxColWidth: 12,
    }); /*?*/
    pretty
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: extractComponent.ts ~ line 121 ~ pretty', pretty)

    const finalContent = `
import { bindable } from 'aurelia-framework';

export class ${className} {
  @bindable qux;
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

  private extractSelectedTexts(getEditorResponse: GetEditorSelectionResponse) {
    const { documentUri, selections } = getEditorResponse;
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
}
