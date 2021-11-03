import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { BindableAttributeLanguageService } from '../languageServer/BindableAttributeLanguageService';
import {
  AttributeRegion,
  AttributeInterpolationRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ValueConverterRegion,
} from '../ViewRegions';
import { IViewRegionsVisitor } from '../ViewRegionsVisitor';

export class RegionLanguageServerVisitor<T> implements IViewRegionsVisitor<T> {
  constructor(public aureliaProgram: AureliaProgram) {}

  visitAttribute(region: AttributeRegion): T {}
  visitAttributeInterpolation(region: AttributeInterpolationRegion): T {}
  visitBindableAttribute(region: BindableAttributeRegion): T {
  }
  visitCustomElement(region: CustomElementRegion): T {}
  visitRepeatFor(region: RepeatForRegion): T {}
  visitTextInterpolation(region: TextInterpolationRegion): T {}
  visitValueConverter(region: ValueConverterRegion): T {}
}
