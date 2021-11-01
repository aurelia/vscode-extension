import * as parse5 from 'parse5';
import SaxStream from 'parse5-sax-parser';
import { getBindableNameFromAttritute } from '../../common/template/aurelia-attributes';

import {
  ViewRegionType,
  ViewRegionSubType,
  RepeatForRegionData,
} from '../embeddedLanguages/embeddedSupport';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type RequiredBy<T, K extends keyof T> = Partial<T> & Pick<T, K>;

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

type CustomElementRegionData = ViewRegionInfoV2[];

interface SourceCodeLocation {
  startOffset: number;
  startCol: number;
  startLine: number;
  endOffset: number;
  endCol: number;
  endLine: number;
}

export class AbstractRegion implements ViewRegionInfoV2 {
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

  static create(info: ViewRegionInfoV2) {
    return new AbstractRegion(info);
  }

  static parse5Start(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute
  ) {}
  static parse5Interpolation(
    startTag: SaxStream.StartTagToken,
    attr: parse5.Attribute,
    interpolationMatch: RegExpExecArray | null
  ) {}
  static parse5End(endTag: SaxStream.EndTagToken, attr: parse5.Attribute) {}
  static parse5Text(
    text: SaxStream.TextToken,
    interpolationMatch: RegExpExecArray | null
  ) {}
}

export class AttributeRegion extends AbstractRegion {
  public readonly type: ViewRegionType.Attribute;

  constructor(info: ViewRegionInfoV2) {
    super(info);
  }

  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = createRegionInfo({
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
      sourceCodeLocation: updatedLocation,
      tagName: startTag.tagName,
      regionValue: attr.value,
    });

    return viewRegion;
  }
}

export class AttributeInterpolationRegion extends AbstractRegion {
  public readonly type: ViewRegionType.AttributeInterpolation;

  constructor(info: ViewRegionInfoV2) {
    super(info);
  }

  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = createRegionInfo({
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

    const interpolationValue = interpolationMatch[1];
    /** Eg. >css="width: ${message}<px;" */
    const endInterpolationLength =
      attrLocation.startOffset +
      startInterpolationLength +
      Number(interpolationValue.length) + // message
      1; // "embrace" end char

    const updatedLocation: parse5.Location = {
      ...attrLocation,
      startOffset: attrLocation.startOffset + startInterpolationLength,
      endOffset: endInterpolationLength,
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
}

export class BindableAttributeRegion extends AbstractRegion {
  public readonly type: ViewRegionType.BindableAttribute;

  constructor(info: ViewRegionInfoV2) {
    super(info);
  }

  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = createRegionInfo({
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
      sourceCodeLocation: updatedLocation,
      regionValue: onlyBindableName,
      tagName: startTag.tagName,
    });
    return viewRegion;
  }
}

export class CustomElementRegion extends AbstractRegion {
  public readonly type: ViewRegionType.CustomElement;

  public data: CustomElementRegionData = [];

  constructor(info: ViewRegionInfoV2) {
    super(info);
  }

  // region static
  static create(info: Optional<ViewRegionInfoV2, 'type'>) {
    const finalInfo = createRegionInfo({
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
  // endregion public
}

export class RepeatForRegion extends AbstractRegion {
  public readonly type: ViewRegionType.RepeatFor;

  constructor(info: ViewRegionInfoV2) {
    super(info);
  }

  static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = createRegionInfo({
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
}

export class TextInterpolationRegion extends AbstractRegion {
  public readonly type: ViewRegionType.TextInterpolation;

  constructor(info: ViewRegionInfoV2) {
    super(info);
  }

  static create(info: Optional<ViewRegionInfoV2, 'type' | 'tagName'>) {
    const finalInfo = createRegionInfo({
      ...info,
      type: ViewRegionType.TextInterpolation,
    });
    return new TextInterpolationRegion(finalInfo);
  }

  static parse5Text(
    text: SaxStream.TextToken,
    interpolationMatch: RegExpExecArray | null
  ) {
    if (interpolationMatch === null) return;
    const attrLocation = text.sourceCodeLocation;
    if (!attrLocation) return;

    /** Eg. \n\n  ${grammarRules.length} */
    const startInterpolationLength =
      attrLocation.startOffset +
      interpolationMatch.index + // width:_
      2; // ${

    /** Eg. >css="width: ${message}<px;" */
    const interpolationValue = interpolationMatch[1];
    const endInterpolationLength =
      startInterpolationLength +
      Number(interpolationValue.length) + // message
      1; // "embrace" end char

    const updatedLocation: parse5.Location = {
      ...attrLocation,
      startOffset: startInterpolationLength,
      endOffset: endInterpolationLength,
    };

    const textRegion = TextInterpolationRegion.create({
      regionValue: interpolationValue,
      sourceCodeLocation: updatedLocation,
      textValue: text.text,
    });

    return textRegion;
  }
}

function createRegionInfo(info: Partial<ViewRegionInfoV2>) {
  return info as ViewRegionInfoV2;
}
