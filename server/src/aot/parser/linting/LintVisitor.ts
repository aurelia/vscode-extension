/* eslint-disable @typescript-eslint/no-empty-function */
import { camelCase } from '@aurelia/kernel';
import { inject } from 'aurelia-dependency-injection';
import { Diagnostic } from 'vscode-languageserver-protocol';

import { AnalyzerService } from '../../../common/services/AnalyzerService';
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
} from '../regions/ViewRegions';
import { IViewRegionsVisitorArray } from '../regions/ViewRegionsVisitor';
import { AttributeRules } from './rules/attributes';
import { BindableAttributeRules } from './rules/bindableAttributes';

@inject(AnalyzerService, AureliaProjects)
export class LintVisitor implements IViewRegionsVisitorArray<Diagnostic> {
  private componentList: IAureliaComponent[];

  constructor(
    private readonly analyzerService: AnalyzerService,
    private readonly aureliaProject: AureliaProjects
  ) {}

  public visitAttribute(region: AttributeRegion) {
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

    const rules = [AttributeRules.preventPrivateMethod];
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

  public visitCustomElement(_region: CustomElementRegion) {
    return [];
  }
  public visitImport(_region: ImportRegion) {
    return [];
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
