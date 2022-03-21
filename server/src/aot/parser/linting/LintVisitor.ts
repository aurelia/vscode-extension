/* eslint-disable @typescript-eslint/no-empty-function */
import * as fs from 'fs';
import * as path from 'path';

import { camelCase } from '@aurelia/kernel';
import { inject } from 'aurelia-dependency-injection';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AnalyzerService } from '../../../common/services/AnalyzerService';
import { RegionService } from '../../../common/services/RegionService';
import { AureliaProjects } from '../../../core/AureliaProjects';
import { IAureliaComponent } from '../../aotTypes';
import {
  AttributeRegion,
  AttributeInterpolationRegion,
  AureliaHtmlRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  ImportRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ValueConverterRegion,
  ViewRegionType,
} from '../regions/ViewRegions';
import { IViewRegionsVisitorArray } from '../regions/ViewRegionsVisitor';
import { AttributeRules } from './rules/attributes';
import { BindableAttributeRules } from './rules/bindableAttributes';
import { CustomElementsRules } from './rules/customElements';
import { ImportsRules } from './rules/imports';

@inject(AnalyzerService, AureliaProjects, RegionService)
export class LintVisitor implements IViewRegionsVisitorArray<Diagnostic> {
  private componentList: IAureliaComponent[];

  constructor(
    private readonly analyzerService: AnalyzerService,
    private readonly aureliaProject: AureliaProjects,
    private readonly regionService: RegionService
  ) {}

  public visitAttribute(region: AttributeRegion, document: TextDocument) {
    const finalDiagnostics: Diagnostic[] = [];

    const component = this.aureliaProject.getComponentByDocument(
      document,
      region.tagName
    );
    if (!component) return [];

    const aureliaProgram = this.analyzerService.getAureliaProgramByDocument({
      uri: component.viewModelFilePath,
    });
    if (!aureliaProgram) return [];

    const attributeRules = new AttributeRules(aureliaProgram);
    const rules = [attributeRules.preventPrivateMethod];

    rules.forEach((rule) => {
      /** .apply -> due to rules array loses context */
      const ruleResult = rule.apply(attributeRules, [region]);
      if (ruleResult) {
        finalDiagnostics.push(ruleResult);
      }
    });

    return finalDiagnostics;
  }

  public visitAttributeInterpolation(_region: AttributeInterpolationRegion) {
    return [];
  }
  public visitAureliaHtmlInterpolation(_region: AureliaHtmlRegion) {
    return [];
  }

  public visitBindableAttribute(region: BindableAttributeRegion): Diagnostic[] {
    const componentList = this.aureliaProject
      .getAll()[0]
      .aureliaProgram?.aureliaComponents?.getAll();
    if (componentList) {
      this.componentList = componentList;
    }

    const component = this.componentList.find(
      (component) => component.componentName === region.tagName
    );
    if (!component) return [];

    const finalDiagnostics: Diagnostic[] = [];
    const bindableName = region.regionValue;
    if (bindableName === undefined) return [];

    const targetBindable = component.classMembers?.find((member) => {
      if (!member.isBindable) return false;

      // HTML (parse5) only allows lowercase letters, so fooBar -> foobar
      const isTargetBindable =
        member.name.toLowerCase() === camelCase(bindableName).toLowerCase();
      // isTargetBindable; /* ? */
      return isTargetBindable;
    });
    // targetBindable; /* ? */

    const rules = [BindableAttributeRules.bindableAttributeNamingConvention];
    const targetProject = this.aureliaProject.getFromPath(
      component.viewModelFilePath
    );
    const aureliaProgram = this.analyzerService.getAureliaProgramByDocument({
      uri: component.viewModelFilePath,
    });
    if (!aureliaProgram) return [];

    rules.forEach((rule) => {
      const ruleResult = rule(
        region,
        targetBindable,
        bindableName,
        aureliaProgram,
        this.componentList
      );
      if (ruleResult) {
        finalDiagnostics.push(ruleResult);
      }
    });

    return finalDiagnostics;
  }

  public visitCustomElement(
    region: CustomElementRegion,
    document: TextDocument
  ) {
    if (region.tagName !== 'empty-view') return [];

    const finalDiagnostics: Diagnostic[] = [];

    const customElementsRules = new CustomElementsRules(
      this.aureliaProject,
      this.regionService
    );
    const rules = [customElementsRules.validImport];

    rules.forEach((rule) => {
      /** .apply -> due to rules array loses context */
      const ruleResult = rule.apply(customElementsRules, [region, document]);
      if (ruleResult) {
        finalDiagnostics.push(ruleResult);
      }
    });

    return finalDiagnostics;
  }

  public visitImport(region: ImportRegion, document: TextDocument) {
    // if (region.tagName !== 'empty-view') return [];

    const finalDiagnostics: Diagnostic[] = [];

    const customElementsRules = new ImportsRules();
    const rules = [customElementsRules.validImportNaming];

    rules.forEach((rule) => {
      /** .apply -> due to rules array loses context */
      const ruleResult = rule.apply(customElementsRules, [region, document]);
      if (ruleResult) {
        finalDiagnostics.push(ruleResult);
      }
    });

    return finalDiagnostics;
  }

  public visitRepeatFor(_region: RepeatForRegion) {
    return [];
  }
  public visitTextInterpolation(_region: TextInterpolationRegion) {
    return [];
  }
  public visitValueConverter(_region: ValueConverterRegion) {
    return [];
  }
}
