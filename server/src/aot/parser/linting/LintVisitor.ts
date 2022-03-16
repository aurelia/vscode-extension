import { camelCase, kebabCase } from '@aurelia/kernel';
import { inject } from 'aurelia-dependency-injection';
import { Position, Range } from 'vscode-html-languageservice';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { PositionUtils } from '../../../common/documens/PositionUtils';
import { AnalyzerService } from '../../../common/services/AnalyzerService';
import { AureliaProjects } from '../../../core/AureliaProjects';
import { IAureliaComponent } from '../../aotTypes';
import { AureliaComponents } from '../../AureliaComponents';
import { getRangeFromRegion } from '../regions/rangeFromRegion';
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

@inject(AnalyzerService)
export class LintVisitor implements IViewRegionsVisitor<void> {
  constructor(
    private readonly analyzerService: AnalyzerService,
    private readonly componentList: IAureliaComponent[]
  ) {}

  public visitAttribute(region: AttributeRegion) {}
  public visitAttributeInterpolation(region: AttributeInterpolationRegion) {}
  public visitAureliaHtmlInterpolation(region: AureliaHtmlRegion) {}

  public visitBindableAttribute(
    aureliaProject: AureliaProjects,
    region: BindableAttributeRegion
  ): Diagnostic[] {
    const finalDiagnostics: Diagnostic[] = [];

    const component = this.componentList.find(
      (component) => component.componentName === region.tagName
    );
    if (!component) return [];
    const bindableName = region.regionValue;
    if (!bindableName) return [];

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
    const targetProject = aureliaProject.getFromPath(
      component.viewModelFilePath
    );
    component;
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

  public visitCustomElement(region: CustomElementRegion) {}
  public visitImport(region: ImportRegion) {}
  public visitRepeatFor(region: RepeatForRegion) {}
  public visitTextInterpolation(region: TextInterpolationRegion) {}
  public visitValueConverter(region: ValueConverterRegion) {}
}
