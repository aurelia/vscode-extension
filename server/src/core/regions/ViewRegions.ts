import * as parse5 from 'parse5';
import SaxStream from 'parse5-sax-parser';
import { Position } from 'vscode-languageserver-textdocument';

import {
  AccessScopeExpression,
  CallScopeExpression,
  ExpressionKind,
  ExpressionType,
  Interpolation,
  parseExpression,
} from '../../common/@aurelia-runtime-patch/src';
import { SourceCodeLocation as ASTSourceCodeLocation } from '../../common/@aurelia-runtime-patch/src/binding/ast';
import { AureliaView } from '../../common/constants';
import { DiagnosticMessages } from '../../common/diagnosticMessages/DiagnosticMessages';
import {
  findAllExpressionRecursive,
  ParseExpressionUtil,
} from '../../common/parseExpression/ParseExpressionUtil';
import { getBindableNameFromAttritute } from '../../common/template/aurelia-attributes';
import { AbstractRegionLanguageService } from './languageServer/AbstractRegionLanguageService';
import { AttributeInterpolationLanguageService } from './languageServer/AttributeInterpolationLanguageService';
import { AttributeLanguageService } from './languageServer/AttributeLanguageService';
import { AureliaHtmlLanguageService } from './languageServer/AureliaHtmlLanguageService';
import { BindableAttributeLanguageService } from './languageServer/BindableAttributeLanguageService';
import { CustomElementLanguageService } from './languageServer/CustomElementLanguageService';
import { ImportLanguageService } from './languageServer/ImportLanguageService';
import { RepeatForLanguageService } from './languageServer/RepeatForLanguageService';
import { TextInterpolationLanguageService } from './languageServer/TextInterpolationLanguageService';
import { ValueConverterLanguageService } from './languageServer/ValueConverterLanguageService';
import { IViewRegionsVisitor } from './ViewRegionsVisitor';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequiredBy<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface ViewRegionInfoV2<RegionDataType = unknown> {
  //
  type: ViewRegionType;
  subType?: ViewRegionSubType;
  //
  sourceCodeLocation: SourceCodeLocation;
  startTagLocation?: SourceCodeLocation;
  //
  tagName: string;
  attributeName?: string;
  attributeValue?: string;
  textValue?: string;
  regionValue?: string;
  //
  accessScopes?: (AccessScopeExpression | CallScopeExpression)[];
  data?: RegionDataType;
}

export enum ViewRegionType {
  Attribute = 'Attribute',
  AttributeInterpolation = 'AttributeInterpolation',
  BindableAttribute = 'BindableAttribute',
  CustomElement = 'CustomElement',
  Html = 'html',
  Import = 'Import',
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
  public subType?: ViewRegionSubType;
  //
  public sourceCodeLocation: SourceCodeLocation;
  public startTagLocation?: SourceCodeLocation;
  //
  public tagName: string;
  public attributeName?: string;
  public attributeValue?: string;
  public textValue?: string;
  public regionValue?: string;
  //
  public accessScopes?: ViewRegionInfoV2['accessScopes'];
  public data?: unknown;

  constructor(info: ViewRegionInfoV2) {
    //
    this.type = info.type;
    if (info.subType !== undefined) this.subType = info.subType;
    //
    this.sourceCodeLocation = {
      startCol: info.sourceCodeLocation.startCol,
      startLine: info.sourceCodeLocation.startLine,
      startOffset: info.sourceCodeLocation.startOffset,
      endLine: info.sourceCodeLocation.endLine,
      endCol: info.sourceCodeLocation.endCol,
      endOffset: info.sourceCodeLocation.endOffset,
    };
    if (info.startTagLocation !== undefined)
      this.startTagLocation = info.startTagLocation;
    //
    this.tagName = info.tagName;
    this.attributeName = info.attributeName;
    this.attributeValue = info.attributeValue;
    if (info.textValue !== undefined) this.textValue = info.textValue;
    if (info.regionValue !== undefined) this.regionValue = info.regionValue;
    //
    if (info.accessScopes !== undefined) this.accessScopes = info.accessScopes;
    if (info.data !== undefined) this.data = info.data;
  }

  // region static
  public static create(info: ViewRegionInfoV2) {
    return info;
  }

  public static is(region: AbstractRegion): unknown {
    return region;
  }

  public static isInterpolationRegion(region: AbstractRegion): boolean {
    const isInterpolationRegion =
      AttributeInterpolationRegion.is(region) === true ||
      TextInterpolationRegion.is(region) === true;

    return isInterpolationRegion;
  }

  // public static parse5Start(
  //   startTag: SaxStream.StartTagToken,
  //   attr: parse5.Attribute
  // ) {}
  // public static parse5Interpolation(
  //   startTag: SaxStream.StartTagToken,
  //   attr: parse5.Attribute,
  //   interpolationMatch: RegExpExecArray | null
  // ) {}
  // public static parse5End(endTag: SaxStream.EndTagToken, attr: parse5.Attribute) {}
  // public static parse5Text(
  //   text: SaxStream.TextToken,
  //   interpolationMatch: RegExpExecArray | null
  // ) {}
  // endregion public

  // region public
  public accept<T>(visitor: IViewRegionsVisitor<T>): T | void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    visitor;
  }

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
  public readonly accessScopes?: AccessScopeExpression[];

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new AttributeLanguageService();
  }

  public static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.Attribute,
    });
    return new AttributeRegion(finalInfo);
  }

  public static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.Attribute;
  }

  public static parse5(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return;

    /** Eg. >click.delegate="<increaseCounter()" */
    const attrNameLength =
      attr.name.length + // click.delegate
      2; // ="

    /** Eg. click.delegate="increaseCounter()><" */
    const lastCharIndex = attrLocation.endOffset - 1; // - 1 the quote

    const startOffset = attrLocation.startOffset + attrNameLength;
    const updatedLocation: parse5.Location = {
      ...attrLocation,
      startOffset,
      endOffset: lastCharIndex,
    };

    const { expressions: accessScopes } =
      ParseExpressionUtil.getAllExpressionsOfKindV2(
        attr.value,
        [ExpressionKind.AccessScope, ExpressionKind.CallScope],
        { startOffset }
      );

    const viewRegion = AttributeRegion.create({
      attributeName: attr.name,
      attributeValue: attr.value,
      sourceCodeLocation: updatedLocation,
      tagName: startTag.tagName,
      accessScopes,
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
  public readonly accessScopes: AccessScopeExpression[];

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new AttributeInterpolationLanguageService();
  }

  public static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.AttributeInterpolation,
    });
    return new AttributeInterpolationRegion(finalInfo);
  }

  public static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.AttributeInterpolation;
  }

  public static parse5Interpolation(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute,
    interpolationMatch: RegExpExecArray | null,
    documentHasCrlf: boolean
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return;

    /** Eg. >click.delegate="<increaseCounter()" */
    const attrNameLength =
      attr.name.length + // click.delegate
      2; // ="
    // attrNameLength /* ? */

    /** Eg. click.delegate="increaseCounter()><" */
    // const lastCharIndex = attrLocation.endOffset - 1; // - 1 the quote

    const startOffset = attrLocation.startOffset + attrNameLength;
    // const updatedLocation: parse5.Location = {
    //   ...attrLocation,
    //   startOffset,
    //   endOffset: lastCharIndex,
    // };

    try {
      // attr.value /* ? */
      const parsed = ParseExpressionUtil.parseInterpolation(
        attr.value,
        startOffset
      );
      // parsed; /* ? */
      // parsed.parts; /* ? */

      // Used to find interpolation(s) inside string
      const stringTracker = attr.value;
      // For each expression "group", create a region
      const finalRegions = parsed?.expressions.map(
        (expression, expressionIndex) => {
          const accessScopes: ViewRegionInfoV2['accessScopes'] = [];
          findAllExpressionRecursive(
            expression,
            [ExpressionKind.AccessScope, ExpressionKind.CallScope],
            accessScopes
          );

          if (documentHasCrlf) {
            accessScopes.forEach((scope) => {
              const { start } = scope.nameLocation;
              const textUntilMatch = attr.value.substring(0, start);
              // crlf = carriage return, line feed (windows specific)
              let numberOfCrlfs = 0;
              const crlfRegex = /\n/g;
              numberOfCrlfs = textUntilMatch.match(crlfRegex)?.length ?? 0;

              scope.nameLocation.start += numberOfCrlfs;
              scope.nameLocation.end += numberOfCrlfs;
            });
          }

          const isLastIndex = expressionIndex === parsed.expressions.length - 1;
          const startInterpol =
            parsed.interpolationStarts[expressionIndex] - startOffset;
          let endInterpol;
          if (isLastIndex) {
            const lastPartLength = parsed.parts[expressionIndex + 1].length;
            endInterpol =
              attrLocation.endOffset -
              1 - // " (closing quote)
              startOffset - //
              lastPartLength; // - lastPartLength: last part can be a normal string, we don't want to include that
          } else {
            endInterpol =
              parsed.interpolationEnds[expressionIndex] - startOffset;
          }
          const potentialRegionValue = stringTracker.substring(
            startInterpol,
            endInterpol
          );

          const updatedStartOffset = startInterpol + startOffset;
          const updatedLocation: SourceCodeLocation = {
            ...attrLocation,
            startOffset: updatedStartOffset,
            endOffset: updatedStartOffset + potentialRegionValue.length,
          };

          // Create default Access scope
          if (accessScopes.length === 0) {
            const nameLocation: ASTSourceCodeLocation = {
              start: updatedLocation.startOffset + 2, // + 2: ${
              end: updatedLocation.endOffset - 1, // - 1: }
            };
            const emptyAccessScope = new AccessScopeExpression(
              '',
              0,
              nameLocation
            );
            accessScopes.push(emptyAccessScope);
          }

          const viewRegion = AttributeInterpolationRegion.create({
            attributeName: attr.name,
            attributeValue: attr.value,
            sourceCodeLocation: updatedLocation,
            tagName: startTag.tagName,
            accessScopes,
            regionValue: potentialRegionValue,
          });

          return viewRegion;
        }
      );

      // finalRegions; /* ?*/
      return finalRegions;
    } catch (error) {
      // const _error = error as Error
      // logger.log(_error.message,{logLevel:'DEBUG'})
      // logger.log(_error.stack,{logLevel:'DEBUG'})
      return [];
    }
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

  public static create() {
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

  public static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.BindableAttribute,
    });
    return new BindableAttributeRegion(finalInfo);
  }

  public static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.BindableAttribute;
  }

  public static parse5Start(
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
  public startTagLocation: SourceCodeLocation;

  public data: CustomElementRegionData = [];

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new CustomElementLanguageService();
  }

  // region public static
  public static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.CustomElement,
    });
    return new CustomElementRegion(finalInfo);
  }
  public static createStart(
    info: RequiredBy<
      ViewRegionInfoV2,
      'sourceCodeLocation' | 'startTagLocation' | 'tagName'
    >
  ) {
    info.subType = ViewRegionSubType.StartTag;
    return CustomElementRegion.create(info);
  }
  public static createEnd(info: Optional<ViewRegionInfoV2, 'type'>) {
    info.subType = ViewRegionSubType.EndTag;
    return CustomElementRegion.create(info);
  }

  public static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.CustomElement;
  }

  public static parse5Start(startTag: SaxStream.StartTagToken) {
    //  startTag/*?*/
    const tagName = startTag.tagName;
    const { sourceCodeLocation } = startTag;
    if (!sourceCodeLocation) return;

    const { startLine, startCol, startOffset } = sourceCodeLocation;
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
      startTagLocation: {
        startCol: sourceCodeLocation.startCol,
        startLine: sourceCodeLocation.startLine,
        startOffset: sourceCodeLocation.startOffset,
        endCol: sourceCodeLocation.endCol,
        endLine: sourceCodeLocation.endLine,
        endOffset: sourceCodeLocation.endOffset,
      },
    });

    return viewRegion;
  }
  public static parse5End(endTag: SaxStream.EndTagToken) {
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
  // endregion public static

  // region public
  public getBindableAttributes(): ViewRegionInfoV2[] {
    const bindableAttributeRegions = this.data?.filter(
      (subRegion) => subRegion.type === ViewRegionType.BindableAttribute
    );
    if (bindableAttributeRegions === undefined) return [];

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

export class ImportRegion extends AbstractRegion {
  public languageService: ImportLanguageService;
  public readonly type: ViewRegionType.Import;
  public startTagLocation: SourceCodeLocation;

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new ImportLanguageService();
  }

  // region public static
  public static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.Import,
    });
    return new ImportRegion(finalInfo);
  }

  public static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.CustomElement;
  }

  public static parse5(startTag: SaxStream.StartTagToken) {
    if (!startTag.sourceCodeLocation) return;

    let importSource: string | undefined;
    startTag.attrs.forEach((attr) => {
      const isFrom = attr.name === AureliaView.IMPORT_FROM_ATTRIBUTE;
      if (isFrom) {
        importSource = attr.value;
      }
    });

    const importRegion = this.create({
      attributeName: AureliaView.IMPORT_FROM_ATTRIBUTE,
      attributeValue: importSource,
      tagName: startTag.tagName,
      sourceCodeLocation: startTag.sourceCodeLocation,
      type: ViewRegionType.Import,
      regionValue: importSource,
      // data: getRepeatForData(),
    });

    return importRegion;
  }
  // endregion public static

  // region public

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitImport(this);
  }
  // endregion public
}

export class RepeatForRegion extends AbstractRegion {
  public languageService: RepeatForLanguageService;
  public readonly type: ViewRegionType.RepeatFor;
  public readonly data: RepeatForRegionData;
  public readonly accessScopes: AccessScopeExpression[];

  constructor(info: ViewRegionInfoV2) {
    super(info);
    this.languageService = new RepeatForLanguageService();
  }

  public static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.RepeatFor,
    });
    return new RepeatForRegion(finalInfo);
  }

  public static parse5Start(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];

    if (!attrLocation) return;
    /** Eg. >repeat.for="<rule of grammarRules" */
    const startInterpolationLength =
      attr.name.length + // click.delegate
      2; // ="

    /** Eg. click.delegate="increaseCounter()><" */
    const endInterpolationLength = attrLocation.endOffset - 1; // - 1 the quote

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
        iterableEndOffset: iterableStartOffset + iterable.length,
      };
      return repeatForData;
    }

    const { expressions: accessScopes } =
      ParseExpressionUtil.getAllExpressionsOfKindV2(
        attr.value,
        [ExpressionKind.AccessScope, ExpressionKind.CallScope],
        { startOffset, expressionType: ExpressionType.IsIterator }
      );

    this.updateWithStartOffset(accessScopes, startOffset);

    const repeatForViewRegion = RepeatForRegion.create({
      accessScopes,
      attributeName: attr.name,
      attributeValue: attr.value,
      sourceCodeLocation: updatedLocation,
      type: ViewRegionType.RepeatFor,
      data: getRepeatForData(),
      regionValue: attr.value,
    });

    return repeatForViewRegion;
  }

  /**
   * Background: RepeatFor parsing only returned the repeat.for="attributeValue"
   *   Thus, we need to add the startOffset of whole file.
   */
  private static updateWithStartOffset(accessScopes: (AccessScopeExpression | CallScopeExpression)[], startOffset: number) {
    accessScopes.forEach(scope => {
      scope.nameLocation.start += startOffset;
      scope.nameLocation.end += startOffset;
    });
  }

  public static is(region: AbstractRegion): region is RepeatForRegion {
    return region.type === ViewRegionType.RepeatFor;
  }

  public accept<T>(visitor: IViewRegionsVisitor<T>): T {
    return visitor.visitRepeatFor(this);
  }
}

export class TextInterpolationRegion extends AbstractRegion {
  public languageService: TextInterpolationLanguageService;

  public readonly type: ViewRegionType.TextInterpolation;
  public readonly accessScopes: AccessScopeExpression[];

  constructor(info: ViewRegionInfoV2) {
    super(info);

    this.languageService = new TextInterpolationLanguageService();
  }

  public static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.TextInterpolation,
    });
    return new TextInterpolationRegion(finalInfo);
  }

  public static is(region: AbstractRegion): region is CustomElementRegion {
    return region.type === ViewRegionType.TextInterpolation;
  }

  /**
   * Text nodes often begin with `\n`, which makes finding by line/col harder.
   * We thus, only modify offset.
   */
  public static parse5Text(
    text: SaxStream.TextToken,
    /** Make up for difference between parse5 (not counting \n) and vscode (counting \n) */
    documentHasCrlf: boolean
  ) {
    const textLocation = text.sourceCodeLocation;
    if (!textLocation) return;

    const startOffset = textLocation.startOffset;
    const { expressions: accessScopes, parts } =
      ParseExpressionUtil.getAllExpressionsOfKindV2(
        text.text,
        [ExpressionKind.AccessScope, ExpressionKind.CallScope],
        { expressionType: ExpressionType.Interpolation, startOffset }
      );

    // crlf fix
    if (documentHasCrlf) {
      accessScopes.forEach((scope) => {
        const { start } = scope.nameLocation;
        const textUntilMatch = text.text.substring(0, start);
        // crlf = carriage return, line feed (windows specific)
        let numberOfCrlfs = 0;
        const crlfRegex = /\n/g;
        numberOfCrlfs = textUntilMatch.match(crlfRegex)?.length ?? 0;

        scope.nameLocation.start += numberOfCrlfs;
        scope.nameLocation.end += numberOfCrlfs;
      });
    }

    if (text.sourceCodeLocation == null) return;

    const textRegion = TextInterpolationRegion.create({
      regionValue: text.text,
      sourceCodeLocation: text.sourceCodeLocation,
      textValue: text.text,
      accessScopes,
    });

    return textRegion;
  }

  public static createRegionsFromExpressionParser(
    text: SaxStream.TextToken,
    documentHasCrlf: boolean
  ): TextInterpolationRegion[] | undefined {
    const textLocation = text.sourceCodeLocation;
    if (!textLocation) return;

    const startOffset = textLocation.startOffset;
    // startOffset; /*?*/
    try {
      // text.text; /* ? */
      const parsed = ParseExpressionUtil.parseInterpolation(
        text.text,
        startOffset
      );
      // parsed; /* ? */
      // parsed.parts; /* ? */

      // Used to find interpolation(s) inside string
      const stringTracker = text.text;
      // For each expression "group", create a region
      const finalRegions = parsed?.expressions.map(
        (expression, expressionIndex) => {
          const accessScopes: ViewRegionInfoV2['accessScopes'] = [];
          findAllExpressionRecursive(
            expression,
            [ExpressionKind.AccessScope, ExpressionKind.CallScope],
            accessScopes
          );

          if (documentHasCrlf) {
            accessScopes.forEach((scope) => {
              const { start } = scope.nameLocation;
              const textUntilMatch = text.text.substring(0, start);
              // crlf = carriage return, line feed (windows specific)
              let numberOfCrlfs = 0;
              const crlfRegex = /\n/g;
              numberOfCrlfs = textUntilMatch.match(crlfRegex)?.length ?? 0;

              scope.nameLocation.start += numberOfCrlfs;
              scope.nameLocation.end += numberOfCrlfs;
            });
          }

          const isLastIndex = expressionIndex === parsed.expressions.length - 1;
          const startInterpol =
            parsed.interpolationStarts[expressionIndex] - startOffset;
          let endInterpol;
          if (isLastIndex) {
            const lastPartLength = parsed.parts[expressionIndex + 1].length;
            endInterpol =
              textLocation.endOffset -
              startOffset - //
              lastPartLength; // - lastPartLength: last part can be a normal string, we don't want to include that
          } else {
            endInterpol =
              parsed.interpolationEnds[expressionIndex] - startOffset;
          }
          const potentialRegionValue = stringTracker.substring(
            startInterpol,
            endInterpol
          );

          const updatedStartOffset = startInterpol + startOffset;
          const updatedLocation: SourceCodeLocation = {
            ...textLocation,
            startOffset: updatedStartOffset,
            endOffset: updatedStartOffset + potentialRegionValue.length,
          };

          // Create default Access scope
          if (accessScopes.length === 0) {
            const nameLocation: ASTSourceCodeLocation = {
              start: updatedLocation.startOffset + 2, // + 2: ${
              end: updatedLocation.endOffset - 1, // - 1: }
            };
            const emptyAccessScope = new AccessScopeExpression(
              '',
              0,
              nameLocation
            );
            accessScopes.push(emptyAccessScope);
          }

          const textRegion = TextInterpolationRegion.create({
            regionValue: potentialRegionValue,
            sourceCodeLocation: updatedLocation,
            textValue: text.text,
            accessScopes,
          });

          return textRegion;
        }
      );

      // finalRegions; /* ?*/
      return finalRegions;
    } catch (error) {
      // const _error = error as Error
      // logger.log(_error.message,{logLevel:'DEBUG'})
      // logger.log(_error.stack,{logLevel:'DEBUG'})
      return [];
    }
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

  public static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = convertToRegionInfo({
      ...info,
      type: ViewRegionType.ValueConverter,
    });
    return new ValueConverterRegion(finalInfo);
  }

  public static is(
    region: AbstractRegion | undefined
  ): region is ValueConverterRegion {
    return region?.type === ViewRegionType.ValueConverter;
  }

  public static parse5Start(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {
    const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
    if (!attrLocation) return [];

    // 6.1. Split up repeat.for='repo of repos | sort:column.value:direction.value | take:10'
    // Don't split || ("or")
    const [initiatorText, ...valueConverterRegionsSplit] =
      attr.value.split(/(?<!\|)\|(?!\|)/g);

    // 6.2. For each value converter
    const valueConverterRegions: ValueConverterRegion[] = [];
    valueConverterRegionsSplit.forEach((valueConverterViewText, index) => {
      // 6.3. Split into name and arguments
      const [valueConverterName, ...valueConverterArguments] =
        valueConverterViewText.split(':');

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
    const copySourceLocation = { ...info.sourceCodeLocation };
    copySourceLocation.startCol -= 1;
    copySourceLocation.startLine -= 1;
    copySourceLocation.endCol -= 1;
    copySourceLocation.endLine -= 1;

    info.sourceCodeLocation = copySourceLocation;
  }
  if (info.startTagLocation) {
    const copyStartTagLocation = { ...info.startTagLocation };
    copyStartTagLocation.startCol -= 1;
    copyStartTagLocation.startLine -= 1;
    copyStartTagLocation.endCol -= 1;
    copyStartTagLocation.endLine -= 1;

    info.startTagLocation = copyStartTagLocation;
  }

  return info as ViewRegionInfoV2;
}
