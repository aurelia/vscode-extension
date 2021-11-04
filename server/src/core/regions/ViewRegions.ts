import * as parse5 from 'parse5';
import SaxStream from 'parse5-sax-parser';
import { Position } from 'vscode-languageserver-textdocument';
import { DiagnosticMessages } from '../../common/diagnosticMessages/DiagnosticMessages';
import { getBindableNameFromAttritute } from '../../common/template/aurelia-attributes';

import { AbstractRegionLanguageService } from './languageServer/AbstractRegionLanguageService';
import { AttributeInterpolationLanguageService } from './languageServer/AttributeInterpolationLanguageService';
import { AttributeLanguageService } from './languageServer/AttributeLanguageService';
import { AureliaHtmlLanguageService } from './languageServer/AureliaHtmlLanguageService';
import { BindableAttributeLanguageService } from './languageServer/BindableAttributeLanguageService';
import { CustomElementLanguageService } from './languageServer/CustomElementLanguageService';
import { RepeatForLanguageService } from './languageServer/RepeatForLanguageService';
import { TextInterpolationLanguageService } from './languageServer/TextInterpolationLanguageService';
import { ValueConverterLanguageService } from './languageServer/ValueConverterLanguageService';
import { IViewRegionsVisitor } from './ViewRegionsVisitor';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequiredBy<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface ViewRegionInfoV2<RegionDataType = any> {
  //
  type: ViewRegionType;
  subType?: ViewRegionSubType;
  //
  sourceCodeLocation: SourceCodeLocation;
  //
  tagName: string;
  attributeName?: string;
  attributeValue?: string;
  textValue?: string;
  regionValue?: string;
  //
  data?: RegionDataType;
}

export enum ViewRegionType {
  Attribute = 'Attribute',
  AttributeInterpolation = 'AttributeInterpolation',
  BindableAttribute = 'BindableAttribute',
  CustomElement = 'CustomElement',
  Html = 'html',
  RepeatFor = 'RepeatFor',
  TextInterpolation = 'TextInterpolation',
  ValueConverter = 'ValueConverter',
}

export enum ViewRegionSubType {
  StartTag = 'StartTag',
  EndTag = 'EndTag',
}

type CustomElementRegionData = AbstractRegion[];

export interface RepeatForRegionData {
  /** repeat.for="num of >numbers<" */
  iterableName: string;
  iterableStartOffset: number;
  iterableEndOffset: number;
  /** repeat.for=">num< of numbers" */
  iterator: string;
}

/**
 * TODO: how to deal with the second valCon?           ___v___
 *
 * repo of repos | sort:column.value:direction.value | take:10
 * _____________   _________________________________
 *     ^initiatorText     ^valueConverterText
 */
export interface ValueConverterRegionData {
  /**
   * ```
   * >repo of repos< | sort:column.value:direction.value | take:10
   * ```
   *
   * TODO: Should initiatro text be only first part or all for `| take:10`?
   */
  initiatorText: string;
  /** ```repo of repos | >sort<:column.value:direction.value | take:10``` */
  valueConverterName: string;
  /** ``` repo of repos | sort:>column.value:direction.value< | take:10 ``` */
  valueConverterText: string;
}

interface SourceCodeLocation {
  startOffset: number;
  startCol: number;
  startLine: number;
  endOffset: number;
  endCol: number;
  endLine: number;
}

export abstract class AbstractRegion implements ViewRegionInfoV2 {
  public languageService: AbstractRegionLanguageService;
  //
  public type: ViewRegionType;
  public subType?: any;
  //
  public sourceCodeLocation: SourceCodeLocation;
  //
  public tagName: string;
  public attributeName?: string;
  public attributeValue?: string;
  public textValue?: string;
  public regionValue?: string;
  //
  public data?: unknown;

  constructor(info: ViewRegionInfoV2) {
    //
    this.type = info.type;
    this.subType = info.subType;
    //
    this.sourceCodeLocation = info.sourceCodeLocation;
    //
    this.tagName = info.tagName;
    this.attributeName = info.attributeName;
    this.attributeValue = info.attributeValue;
    this.textValue = info.textValue;
    this.regionValue = info.regionValue;
    //
    this.data = info.data;
  }

  // region static
  static create(info: ViewRegionInfoV2) {}

  static is(region: AbstractRegion): any {}

  // static parse5Start(
  //   startTag: SaxStream.StartTagToken,
  //   attr: parse5.Attribute
  // ) {}
  // static parse5Interpolation(
  //   startTag: SaxStream.StartTagToken,
  //   attr: parse5.Attribute,
  //   interpolationMatch: RegExpExecArray | null
  // ) {}
  // static parse5End(endTag: SaxStream.EndTagToken, attr: parse5.Attribute) {}
  // static parse5Text(
  //   text: SaxStream.TextToken,
  //   interpolationMatch: RegExpExecArray | null
  // ) {}
  // endregion public

  // region public
  public accept<T>(visitor: IViewRegionsVisitor<T>): T | void {}

  public getStartPosition(): Position {
    return {
      line: this.sourceCodeLocation.startLine,
      character: this.sourceCodeLocation.startCol,
    };
  }
  public getEndPosition(): Position {
    return {
      line: this.sourceCodeLocation.endLine,
      character: this.sourceCodeLocation.endCol,
    };
  }
  // endregion public
}

export class AttributeRegion extends AbstractRegion {
  public languageService: AttributeLanguageService;
  public readonly type: ViewRegionType.Attribute;

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new AttributeLanguageService();
  }

  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.Attribute,
    });
    return new AttributeRegion(finalInfo);
  }

  static parse5(startTag: SaxStream.StartTagToken, attr: parse5.Attribute) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return;

    /** Eg. >click.delegate="<increaseCounter()" */
    const attrNameLength =
      attr.name.length + // click.delegate
      2; // ="

    /** Eg. click.delegate="increaseCounter()>"< */
    const lastCharIndex = attrLocation.endOffset;

    const updatedLocation: parse5.Location = {
      ...attrLocation,
      startOffset: attrLocation.startOffset + attrNameLength,
      endOffset: lastCharIndex,
    };

    const viewRegion = AttributeRegion.create({
      attributeName: attr.name,
      attributeValue: attr.value,
      sourceCodeLocation: updatedLocation,
      tagName: startTag.tagName,
      regionValue: attr.value,
    });

    return viewRegion;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitAttribute(this);
  }
}

export class AttributeInterpolationRegion extends AbstractRegion {
  public languageService: AttributeInterpolationLanguageService;
  public readonly type: ViewRegionType.AttributeInterpolation;

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new AttributeInterpolationLanguageService();
  }

  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.AttributeInterpolation,
    });
    return new AttributeInterpolationRegion(finalInfo);
  }

  static parse5Interpolation(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute,
    interpolationMatch: RegExpExecArray | null
  ) {
    if (interpolationMatch === null) return;
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return;

    /** Eg. >css="width: ${<message}px;" */
    const startInterpolationLength =
      attr.name.length + // css
      2 + // ="
      interpolationMatch.index + // width:_
      2; // ${

    const startOffset = attrLocation.startOffset + startInterpolationLength;
    const startCol = attrLocation.startCol + startInterpolationLength;

    const interpolationValue = interpolationMatch[1];
    /** Eg. css="width: ${>message}<px;" */
    const endInterpolationLength = Number(interpolationValue.length); // message
    // 1; // "embrace" end char // need?

    const updatedLocation: parse5.Location = {
      ...attrLocation,
      startOffset,
      startCol: startCol,
      endOffset: startOffset + endInterpolationLength,
      endCol: startCol + endInterpolationLength,
    };

    const viewRegion = AttributeInterpolationRegion.create({
      attributeName: attr.name,
      attributeValue: attr.value,
      sourceCodeLocation: updatedLocation,
      tagName: startTag.tagName,
      regionValue: interpolationMatch[1],
    });

    return viewRegion;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitAttributeInterpolation(this);
  }
}

export class AureliaHtmlRegion extends AbstractRegion {
  public languageService: AureliaHtmlLanguageService;
  public readonly type: ViewRegionType.Html;

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new AureliaHtmlLanguageService();
  }

  static create() {
    const finalInfo = convertToRegionInfo({
      sourceCodeLocation: {
        startLine: 0,
        startCol: 0,
        startOffset: 0,
        endLine: 0,
        endCol: 0,
        endOffset: 0,
      },
      type: ViewRegionType.AttributeInterpolation,
    });
    return new AureliaHtmlRegion(finalInfo);
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitAureliaHtmlInterpolation(this);
  }
}

export class BindableAttributeRegion extends AbstractRegion {
  public languageService: BindableAttributeLanguageService;
  public readonly type: ViewRegionType.BindableAttribute;

  constructor(info: ViewRegionInfoV2) {
    super(info);

    this.languageService = new BindableAttributeLanguageService();
  }

  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.BindableAttribute,
    });
    return new BindableAttributeRegion(finalInfo);
  }

  static parse5Start(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return;

    const startOffset = attrLocation.startOffset;
    /** Eg. >click.delegate="<increaseCounter()" */
    const onlyBindableName = getBindableNameFromAttritute(attr.name);
    const endOffset = startOffset + onlyBindableName.length;
    const updatedLocation = {
      ...attrLocation,
      startOffset,
      endOffset,
      endCol: attrLocation.startCol + onlyBindableName.length,
    };

    const viewRegion = BindableAttributeRegion.create({
      attributeName: attr.name,
      attributeValue: attr.value,
      sourceCodeLocation: updatedLocation,
      regionValue: onlyBindableName,
      tagName: startTag.tagName,
    });
    return viewRegion;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitBindableAttribute(this);
  }
}

export class CustomElementRegion extends AbstractRegion {
  public languageService: CustomElementLanguageService;
  public readonly type: ViewRegionType.CustomElement;

  public data: CustomElementRegionData = [];

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new CustomElementLanguageService();
  }

  // region static
  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.CustomElement,
    });
    return new CustomElementRegion(finalInfo);
  }
  static createStart(
    info: RequiredBy<ViewRegionInfoV2, 'sourceCodeLocation' | 'tagName'>
  ) {
    info.subType = ViewRegionSubType.StartTag;
    return CustomElementRegion.create(info);
  }
  static createEnd(info: Optional<ViewRegionInfoV2, 'type'>) {
    info.subType = ViewRegionSubType.EndTag;
    return CustomElementRegion.create(info);
  }

  static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.CustomElement;
  }

  static parse5Start(startTag: SaxStream.StartTagToken) {
    const tagName = startTag.tagName;
    const { sourceCodeLocation } = startTag;
    if (!sourceCodeLocation) return;

    const { startLine, startCol, startOffset, endOffset } = sourceCodeLocation;
    const finalStartCol = startCol + 1; // + 1 for "<" of closing tag
    const finalStartOffset = startOffset + 1; // + 1 for < of closing tag
    const finalEndCol = finalStartCol + tagName.length;
    const finalEndOffset = finalStartOffset + tagName.length;
    const onlyOpeningTagLocation = {
      startCol: finalStartCol,
      startOffset: finalStartOffset,
      startLine,
      endLine: startLine,
      endCol: finalEndCol,
      endOffset: finalEndOffset,
    };

    const viewRegion = CustomElementRegion.createStart({
      tagName,
      sourceCodeLocation: onlyOpeningTagLocation,
    });

    return viewRegion;
  }
  static parse5End(endTag: SaxStream.EndTagToken) {
    const { sourceCodeLocation } = endTag;
    if (!sourceCodeLocation) return;

    const { startCol, startOffset, endOffset } = sourceCodeLocation;
    const finalStartCol = startCol + 2; // + 2 for "</" of closing tag
    const finalStartOffset = startOffset + 2; // + 2 for </ of closing tag
    const finalEndCol = finalStartCol + endTag.tagName.length;
    const finalEndOffset = endOffset - 1; // - 1 > of closing tag
    const updatedEndLocation = {
      ...sourceCodeLocation,
      startCol: finalStartCol,
      startOffset: finalStartOffset,
      endCol: finalEndCol,
      endOffset: finalEndOffset,
    };

    const customElementViewRegion = CustomElementRegion.createEnd({
      tagName: endTag.tagName,
      sourceCodeLocation: updatedEndLocation,
    });

    return customElementViewRegion;
  }
  // endregion static

  // region public
  public getBindableAttributes(): ViewRegionInfoV2[] {
    const bindableAttributeRegions = this.data?.filter(
      (subRegion) => subRegion.type === ViewRegionType.BindableAttribute
    );
    if (!bindableAttributeRegions) return [];

    return bindableAttributeRegions;
  }

  public addBindable(
    info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>
  ): void {
    const finalInfo: ViewRegionInfoV2 = {
      ...info,
      type: ViewRegionType.BindableAttribute,
      tagName: this.tagName,
    };
    const bindableAttribute = BindableAttributeRegion.create(finalInfo);
    this.data.push(bindableAttribute);
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitCustomElement(this);
  }
  // endregion public
}

export class RepeatForRegion extends AbstractRegion {
  public languageService: RepeatForLanguageService;
  public readonly type: ViewRegionType.RepeatFor;
  public readonly data: RepeatForRegionData;

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new RepeatForLanguageService();
  }

  static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.RepeatFor,
    });
    return new RepeatForRegion(finalInfo);
  }

  static parse5Start(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];

    if (!attrLocation) return;
    /** Eg. >repeat.for="<rule of grammarRules" */
    const startInterpolationLength =
      attr.name.length + // click.delegate
      2; // ="

    /** Eg. click.delegate="increaseCounter()>"< */
    const endInterpolationLength = attrLocation.endOffset;

    // __<label repeat.for="rule of grammarRules">
    const startColAdjust =
      attrLocation.startCol + // __<label_
      attr.name.length + // repeat.for
      2 - // ="
      1; // index starts from 0

    const startOffset = attrLocation.startOffset + startInterpolationLength;
    const updatedLocation: parse5.Location = {
      ...attrLocation,
      startOffset: startOffset,
      startCol: startColAdjust,
      endOffset: endInterpolationLength,
    };
    // eslint-disable-next-line no-inner-declarations
    function getRepeatForData() {
      const [iterator, ofKeyword, iterable] = attr.value.split(' ');
      const iterableStartOffset =
        startOffset +
        iterator.length + // iterator
        1 + // space
        ofKeyword.length + // of
        1; // space
      const repeatForData: RepeatForRegionData = {
        iterator,
        iterableName: iterable,
        iterableStartOffset,
        iterableEndOffset: iterableStartOffset + iterable.length + 1,
      };
      return repeatForData;
    }
    const repeatForViewRegion = RepeatForRegion.create({
      attributeName: attr.name,
      sourceCodeLocation: updatedLocation,
      type: ViewRegionType.RepeatFor,
      data: getRepeatForData(),
      regionValue: attr.value,
    });

    return repeatForViewRegion;
  }

  static is(region: AbstractRegion): region is RepeatForRegion {
    return region.type === ViewRegionType.RepeatFor;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitRepeatFor(this);
  }
}

export class TextInterpolationRegion extends AbstractRegion {
  public languageService: TextInterpolationLanguageService;

  public readonly type: ViewRegionType.TextInterpolation;

  constructor(info: ViewRegionInfoV2) {
    super(info);

    this.languageService = new TextInterpolationLanguageService();
  }

  static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.TextInterpolation,
    });
    return new TextInterpolationRegion(finalInfo);
  }

  /**
   * Text nodes often begin with `\n`, which makes finding by line/col harder.
   * We thus, only modify offset.
   */
  static parse5Text(
    text: SaxStream.TextToken,
    interpolationMatch: RegExpExecArray | null
  ) {
    if (interpolationMatch === null) return;
    const textLocation = text.sourceCodeLocation;
    if (!textLocation) return;

    /** Eg. \n\n  ${grammarRules.length} */
    const startInterpolationLength =
      interpolationMatch.index + // width:_
      2; // ${

    const startOffset = textLocation.startOffset + startInterpolationLength;
    /** Eg. >css="width: ${message}<px;" */
    const interpolationValue = interpolationMatch[1];
    const endInterpolationLength =
      Number(interpolationValue.length) + // message
      1; // "embrace" end char
    const endOffset = startOffset + endInterpolationLength;

    const updatedLocation: parse5.Location = {
      ...textLocation,
      startOffset,
      endOffset,
    };

    const textRegion = TextInterpolationRegion.create({
      regionValue: interpolationValue,
      sourceCodeLocation: updatedLocation,
      textValue: text.text,
    });

    return textRegion;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitTextInterpolation(this);
  }
}

export class ValueConverterRegion extends AbstractRegion {
  public languageService: ValueConverterLanguageService;
  public data: ValueConverterRegionData;
  public readonly type: ViewRegionType.ValueConverter;

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new ValueConverterLanguageService();
  }

  static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.ValueConverter,
    });
    return new ValueConverterRegion(finalInfo);
  }

  static is(
    region: AbstractRegion | undefined
  ): region is ValueConverterRegion {
    return region?.type === ViewRegionType.ValueConverter;
  }

  static parse5Start(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return [];

    // 6.1. Split up repeat.for='repo of repos | sort:column.value:direction.value | take:10'
    // Don't split || ("or")
    const [initiatorText, ...valueConverterRegionsSplit] = attr.value.split(
      /(?<!\|)\|(?!\|)/g
    );

    // 6.2. For each value converter
    const valueConverterRegions: ValueConverterRegion[] = [];
    valueConverterRegionsSplit.forEach((valueConverterViewText, index) => {
      // 6.3. Split into name and arguments
      const [
        valueConverterName,
        ...valueConverterArguments
      ] = valueConverterViewText.split(':');

      if (valueConverterRegionsSplit.length >= 2 && index >= 1) {
        const dm = new DiagnosticMessages(
          'Chained value converters not supported yet.'
        );
        dm.log();
        dm.additionalLog('No infos for', valueConverterViewText);
        return;
      }

      const startValueConverterLength =
        attr.name.length /** repeat.for */ +
        2 /** =' */ +
        initiatorText.length /** repo of repos_ */ +
        1; /** | */

      const startColAdjust =
        attrLocation.startCol /** indentation and to length attribute */ +
        startValueConverterLength;

      const endValueConverterLength =
        startValueConverterLength + valueConverterViewText.length;

      const endColAdjust = startColAdjust + valueConverterViewText.length;

      // 6.4. Save the location
      const updatedLocation: parse5.Location = {
        ...attrLocation,
        startOffset: attrLocation.startOffset + startValueConverterLength - 1, // [!] Don't include '|', because when we type |, we already want to  get completions
        startCol: startColAdjust,
        endOffset: attrLocation.startOffset + endValueConverterLength,
        endCol: endColAdjust,
      };

      // 6.5. Create region with useful info
      const valueConverterRegion = ValueConverterRegion.create({
        attributeName: attr.name,
        sourceCodeLocation: updatedLocation,
        type: ViewRegionType.ValueConverter,
        regionValue: attr.value,
        data: {
          initiatorText,
          valueConverterName: valueConverterName.trim(),
          valueConverterText: valueConverterArguments.join(':'),
        },
      });
      valueConverterRegions.push(valueConverterRegion);
    });

    return valueConverterRegions;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitValueConverter(this);
  }
}

function convertToRegionInfo(info: Partial<ViewRegionInfoV2>) {
  // Convert to zero-based (col and line from parse5 is one-based)
  if (info.sourceCodeLocation) {
    info.sourceCodeLocation.startCol -= 1;
    info.sourceCodeLocation.startLine -= 1;
    info.sourceCodeLocation.endCol -= 1;
    info.sourceCodeLocation.endLine -= 1;
  }

  return info as ViewRegionInfoV2;
}
