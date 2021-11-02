import {
  AttributeInterpolationRegion,
  AttributeRegion,
  BindableAttributeRegion,
  CustomElementRegion,
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
  visitBindableAttribute(region: BindableAttributeRegion): T;
  visitCustomElement(region: CustomElementRegion): T;
  visitRepeatFor(region: RepeatForRegion): T;
  visitTextInterpolation(region: TextInterpolationRegion): T;
  visitValueConverter(region: ValueConverterRegion): T;
}
