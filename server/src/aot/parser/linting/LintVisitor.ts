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
import { IViewRegionsVisitor } from '../regions/ViewRegionsVisitor';
import { BindableAttributeRules } from './rules/bindableAttributes';

@inject(AnalyzerService, AureliaProjects)
export class LintVisitor implements IViewRegionsVisitor<void> {
  private componentList: IAureliaComponent[];

  constructor(
    private readonly analyzerService: AnalyzerService,
    private readonly aureliaProject: AureliaProjects
  ) {

  }

  public visitAttribute(_region: AttributeRegion) {}
  public visitAttributeInterpolation(_region: AttributeInterpolationRegion) {}
  public visitAureliaHtmlInterpolation(_region: AureliaHtmlRegion) {}

  public visitBindableAttribute(region: BindableAttributeRegion): Diagnostic[] {
    const componentList = this.aureliaProject.getAll()[0].aureliaProgram?.aureliaComponents?.getAll();
    if (componentList) {
      this.componentList = componentList;
    }

    const finalDiagnostics: Diagnostic[] = [];

    const component = this.componentList.find(
      (component) => component.componentName === region.tagName
    );
    if (!component) return [];
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

    const rules = [
      BindableAttributeRules.bindableAttributeNamingConvention,
      BindableAttributeRules.preventPrivateMethod,
    ];
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

  public visitCustomElement(_region: CustomElementRegion) {}
  public visitImport(_region: ImportRegion) {}
  public visitRepeatFor(_region: RepeatForRegion) {}
  public visitTextInterpolation(_region: TextInterpolationRegion) {}
  public visitValueConverter(_region: ValueConverterRegion) {}
}
