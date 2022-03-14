import { camelCase, kebabCase } from '@aurelia/kernel';
import { Container } from 'aurelia-dependency-injection';
import { Position, Range } from 'vscode-html-languageservice';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { PositionUtils } from '../../../common/documens/PositionUtils';
import { AnalyzerService } from '../../../common/services/AnalyzerService';
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

export class LintVisitor implements IViewRegionsVisitor<void> {
  constructor(private readonly componentList: IAureliaComponent[]) {}

  public visitAttribute(region: AttributeRegion) {}
  public visitAttributeInterpolation(region: AttributeInterpolationRegion) {}
  public visitAureliaHtmlInterpolation(region: AureliaHtmlRegion) {}

  public visitBindableAttribute(
    region: BindableAttributeRegion,
    tagName: string
  ): Diagnostic[] {
    const component = this.componentList.find(
      (component) => component.componentName === tagName
    );
    if (!component) return [];
    // component; /* ? */
    const bindableName = region.regionValue;
    if (!bindableName) return [];

    const targetBindable = component.classMembers?.find((member) => {
      if (!member.isBindable) return false;

      // HTML (parse5) only allows lowercase letters, so fooBar -> foobar
      const isTargetBindable = member.name.toLocaleLowerCase() === bindableName;
      // isTargetBindable; /* ? */
      return isTargetBindable;
    });
    // targetBindable; /* ? */

    let message = ''

    if (kebabCase(bindableName) === kebabCase(targetBindable?.name ?? '')) {
      return []
    }  if (!targetBindable) {
      message = `Not found. No such bindable: '${region.regionValue}'`
    } else {
      message = `Invalid casing. Did you mean: '${kebabCase(targetBindable.name)}'?`
    }

    const range = getRangeFromRegion(region);
    if (!range) return [];
    const diag = Diagnostic.create(range, message);

    return [diag];
  }

  public visitCustomElement(region: CustomElementRegion) {}
  public visitImport(region: ImportRegion) {}
  public visitRepeatFor(region: RepeatForRegion) {}
  public visitTextInterpolation(region: TextInterpolationRegion) {}
  public visitValueConverter(region: ValueConverterRegion) {}
}
