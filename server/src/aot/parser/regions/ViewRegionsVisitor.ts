import { TextDocument } from 'vscode-languageserver-textdocument';
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
  visitBindableAttribute(region: BindableAttributeRegion): T;
  visitCustomElement(region: CustomElementRegion): T;
  visitImport(region: ImportRegion): T;
  visitRepeatFor(region: RepeatForRegion): T;
  visitTextInterpolation(region: TextInterpolationRegion): T;
  visitValueConverter(region: ValueConverterRegion): T;
}

export interface IViewRegionsVisitorArray<T = unknown> {
  visitAttribute(region: AttributeRegion, document: TextDocument): T[];
  visitAttributeInterpolation(
    region: AttributeInterpolationRegion,
    document: TextDocument
  ): T[];
  visitAureliaHtmlInterpolation(
    region: AureliaHtmlRegion,
    document: TextDocument
  ): T[];
  visitBindableAttribute(
    region: BindableAttributeRegion,
    document: TextDocument
  ): T[];
  visitCustomElement(region: CustomElementRegion, document: TextDocument): T[];
  visitImport(region: ImportRegion, document: TextDocument): T[];
  visitRepeatFor(region: RepeatForRegion, document: TextDocument): T[];
  visitTextInterpolation(
    region: TextInterpolationRegion,
    document: TextDocument
  ): T[];
  visitValueConverter(
    region: ValueConverterRegion,
    document: TextDocument
  ): T[];
}
