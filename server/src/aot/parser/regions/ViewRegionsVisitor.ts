import { AureliaProjects } from '../../../core/AureliaProjects';
import {
  AttributeInterpolationRegion,
  AttributeRegion,
  AureliaHtmlRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  ImportRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ValueConverterRegion,
} from './ViewRegions';

export interface IVisitor {
  accept: () => {};
}

export interface IViewRegionsVisitor<T = unknown> {
  visitAttribute(region: AttributeRegion): T;
  visitAttributeInterpolation(region: AttributeInterpolationRegion): T;
  visitAureliaHtmlInterpolation(region: AureliaHtmlRegion): T;
  visitBindableAttribute(
    aureliaProject: AureliaProjects,
    region: BindableAttributeRegion
  ): T;
  visitCustomElement(region: CustomElementRegion): T;
  visitImport(region: ImportRegion): T;
  visitRepeatFor(region: RepeatForRegion): T;
  visitTextInterpolation(region: TextInterpolationRegion): T;
  visitValueConverter(region: ValueConverterRegion): T;
}
