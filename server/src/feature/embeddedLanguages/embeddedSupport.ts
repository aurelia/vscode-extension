import * as parse5 from 'parse5';
import * as SaxStream from 'parse5-sax-parser';
import { Position, Range } from './languageModes';
import { AURELIA_ATTRIBUTES_KEYWORDS } from '../../configuration/DocumentSettings';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaView } from '../../common/constants';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../../viewModel/AureliaProgram';
import { DiagnosticMessages } from '../../common/DiagnosticMessages';
import { AsyncReturnType } from '../../common/global';

export interface LanguageRange extends Range {
  languageId: string | undefined;
  attributeValue?: boolean;
}

export interface HTMLDocumentRegions {
  getEmbeddedDocument(
    languageId: string,
    ignoreAttributeValues?: boolean
  ): TextDocument;
  getLanguageRanges(range: Range): LanguageRange[];
  getLanguageAtPosition(position: Position): string | undefined;
  getLanguagesInDocument(): string[];
  getImportedScripts(): string[];
  getRegionAtPosition(position: Position): ViewRegionInfo | undefined;
  getRegions(): ViewRegionInfo[];
}

export const CSS_STYLE_RULE = '__';

export enum ViewRegionType {
  Attribute = 'Attribute',
  AttributeInterpolation = 'AttributeInterpolation',
  Html = 'html',
  RepeatFor = 'RepeatFor',
  TextInterpolation = 'TextInterpolation',
  CustomElement = 'CustomElement',
  ValueConverter = 'ValueConverter',
}

export interface ViewRegionInfo<RegionDataType = any> {
  type?: ViewRegionType;
  languageId: ViewRegionType;
  startOffset?: number;
  startCol?: number;
  startLine?: number;
  endOffset?: number;
  endCol?: number;
  endLine?: number;
  attributeName?: string;
  attributeValue?: string;
  tagName?: string;
  regionValue?: string;
  data?: RegionDataType;
}

export interface RepeatForRegionData {
  /** repeat.for="num of >numbers<" */
  iterableName: string;
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

export type CustomElementRegionData = ViewRegionInfo[];

export const aureliaLanguageId = 'aurelia';

// eslint-disable-next-line max-lines-per-function
export function parseDocumentRegions<RegionDataType = any>(
  document: TextDocument,
  aureliaProgram: AureliaProgram = importedAureliaProgram
): Promise<ViewRegionInfo<RegionDataType>[]> {
  // eslint-disable-next-line max-lines-per-function
  return new Promise((resolve) => {
    if (document.getText() === '') {
      resolve([]);
      return;
    }

    console.log('[eb.ts] Starting document parsing');
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });
    const viewRegions: ViewRegionInfo[] = [];
    const interpolationRegex = /\$(?:\s*)\{(?!\s*`)(.*?)\}/g;
    let hasImportTemplateTag = false;

    const aureliaCustomElementNames = aureliaProgram
      .getComponentList()
      .map((component) => component.componentName);

    // 0. Check if template was imported to ViewModel
    const fileName = document.uri;
    const targetComponent = aureliaProgram
      .getComponentList()
      .find((component) => {
        const { viewFilePath } = component;
        /** Account for "file://" */
        if (viewFilePath === undefined) return false;

        const isSameFilePath = fileName.includes(viewFilePath);
        return isSameFilePath;
      });

    hasImportTemplateTag = targetComponent !== undefined;

    // 1. Check if in <template>
    let hasTemplateTag = false;

    /**
     * 1. Template Tag
     * 2. Attributes
     * 3. Attribute Interpolation
     * 4. Custom element
     * 5. repeat.for=""
     * 6. Value converter region (value | take:10)
     */
    // eslint-disable-next-line max-lines-per-function
    saxStream.on('startTag', (startTag) => {
      const customElementAttributeRegions: ViewRegionInfo[] = [];
      const { tagName } = startTag;
      const isTemplateTag = tagName === AureliaView.TEMPLATE_TAG_NAME;
      // 1. Template tag
      if (isTemplateTag) {
        hasTemplateTag = true;
      }

      if (!hasTemplateTag && !hasImportTemplateTag) return;

      // Attributes and Interpolation
      startTag.attrs.forEach((attr) => {
        const isAttributeKeyword = AURELIA_ATTRIBUTES_KEYWORDS.some(
          (keyword) => {
            return attr.name.includes(keyword);
          }
        );
        const isRepeatFor = attr.name === AureliaView.REPEAT_FOR;

        /**
         * TODO OPTIMIZATION split if/else-if/else into if with early return
         * Reason: Currently, we check for all possible cases beforehand via the const `is...`
         */
        // 2. Attributes
        if (isAttributeKeyword) {
          const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];

          if (!attrLocation) return;
          /** Eg. >click.delegate="<increaseCounter()" */
          const startInterpolationLength =
            attr.name.length + // click.delegate
            2; // ="

          /** Eg. click.delegate="increaseCounter()>"< */
          const endInterpolationLength = attrLocation.endOffset - 1;

          const updatedLocation: parse5.Location = {
            ...attrLocation,
            startOffset: attrLocation.startOffset + startInterpolationLength,
            endOffset: endInterpolationLength,
          };
          const viewRegion = createRegion({
            attribute: attr,
            attributeName: attr.name,
            sourceCodeLocation: updatedLocation,
            type: ViewRegionType.Attribute,
          });
          viewRegions.push(viewRegion);
          customElementAttributeRegions.push(viewRegion);
        } else if (isRepeatFor) {
          // 5. Repeat for
          const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];

          if (!attrLocation) return;
          /** Eg. >repeat.for="<rule of grammarRules" */
          const startInterpolationLength =
            attr.name.length + // click.delegate
            2; // ="

          /** Eg. click.delegate="increaseCounter()>"< */
          const endInterpolationLength = attrLocation.endOffset - 1;

          // __<label repeat.for="rule of grammarRules">
          const startColAdjust =
            attrLocation.startCol + // __<label_
            attr.name.length + // repeat.for
            2 - // ="
            1; // index starts from 0

          const updatedLocation: parse5.Location = {
            ...attrLocation,
            startOffset: attrLocation.startOffset + startInterpolationLength,
            startCol: startColAdjust,
            endOffset: endInterpolationLength,
          };
          // eslint-disable-next-line no-inner-declarations
          function getRepeatForData() {
            const splitUpRepeatFor = attr.value.split(' ');
            const repeatForData: RepeatForRegionData = {
              iterator: splitUpRepeatFor[0],
              iterableName: splitUpRepeatFor[2],
            };
            return repeatForData;
          }
          const repeatForViewRegion = createRegion<RepeatForRegionData>({
            attributeName: attr.name,
            sourceCodeLocation: updatedLocation,
            type: ViewRegionType.RepeatFor,
            data: getRepeatForData(),
            regionValue: attr.value,
          });
          viewRegions.push(repeatForViewRegion);
        } else {
          // 3. Attribute Interpolation
          let interpolationMatch;
          while ((interpolationMatch = interpolationRegex.exec(attr.value))) {
            if (interpolationMatch !== null) {
              const attrLocation =
                startTag.sourceCodeLocation?.attrs[attr.name];
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
                Number(interpolationValue.length); // message

              const updatedLocation: parse5.Location = {
                ...attrLocation,
                startOffset:
                  attrLocation.startOffset + startInterpolationLength,
                endOffset: endInterpolationLength,
              };

              const viewRegion = createRegion({
                attributeName: attr.name,
                sourceCodeLocation: updatedLocation,
                type: ViewRegionType.AttributeInterpolation,
                regionValue: interpolationMatch[1],
              });
              viewRegions.push(viewRegion);
            }
          }
        }

        const isValueConverterRegion = attr.value.includes(
          AureliaView.VALUE_CONVERTER_OPERATOR
        );
        // 6. Value converter region
        if (isValueConverterRegion) {
          const attrLocation = startTag.sourceCodeLocation?.attrs[attr.name];
          if (!attrLocation) return;

          // 6.1. Split up repeat.for='repo of repos | sort:column.value:direction.value | take:10'
          // Don't split || ("or")
          const [
            initiatorText,
            ...valueConverterRegionsSplit
          ] = attr.value.split(/[^|]\|[^|]/g);

          // 6.2. For each value converter
          valueConverterRegionsSplit.forEach(
            (valueConverterViewText, index) => {
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

              const endColAdjust =
                startColAdjust + valueConverterViewText.length;

              // 6.4. Save the location
              const updatedLocation: parse5.Location = {
                ...attrLocation,
                startOffset:
                  attrLocation.startOffset + startValueConverterLength,
                startCol: startColAdjust,
                endOffset: attrLocation.startOffset + endValueConverterLength,
                endCol: endColAdjust,
              };

              // 6.5. Create region with useful info
              const valueConverterRegion = createRegion<ValueConverterRegionData>(
                {
                  attributeName: attr.name,
                  sourceCodeLocation: updatedLocation,
                  type: ViewRegionType.ValueConverter,
                  regionValue: attr.value,
                  data: {
                    initiatorText,
                    valueConverterName: valueConverterName.trim(),
                    valueConverterText: valueConverterArguments.join(':'),
                  },
                }
              );
              viewRegions.push(valueConverterRegion);
            }
          );
        }
      });

      // 4. Custom elements
      const isCustomElement = aureliaCustomElementNames.includes(tagName);
      if (isCustomElement) {
        const customElementViewRegion = createRegion({
          tagName,
          sourceCodeLocation: startTag.sourceCodeLocation,
          type: ViewRegionType.CustomElement,
          data: customElementAttributeRegions,
        });
        viewRegions.push(customElementViewRegion);
      }
    });

    saxStream.on('text', (text) => {
      let interpolationMatch;
      while ((interpolationMatch = interpolationRegex.exec(text.text))) {
        if (interpolationMatch !== null) {
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
            startInterpolationLength + Number(interpolationValue.length); // message

          const updatedLocation: parse5.Location = {
            ...attrLocation,
            startOffset: startInterpolationLength,
            endOffset: endInterpolationLength,
          };

          const viewRegion = createRegion({
            regionValue: interpolationValue,
            sourceCodeLocation: updatedLocation,
            type: ViewRegionType.TextInterpolation,
          });
          viewRegions.push(viewRegion);
        }
      }
    });

    saxStream.on('endTag', (endTag) => {
      const isTemplateTag = endTag.tagName === AureliaView.TEMPLATE_TAG_NAME;

      if (isTemplateTag || hasImportTemplateTag) {
        resolve(viewRegions);
      }
    });

    saxStream.write(document.getText());
  });
}

export async function getDocumentRegions(
  document: TextDocument
): Promise<HTMLDocumentRegions> {
  let regions: AsyncReturnType<typeof parseDocumentRegions>;
  try {
    regions = await parseDocumentRegions(document);
  } catch (error) {
    console.log('TCL: error', error);
  }

  return {
    getLanguageRanges: (range: Range) =>
      getLanguageRanges(document, regions, range),
    getEmbeddedDocument: (languageId: string, ignoreAttributeValues: boolean) =>
      getEmbeddedDocument(document, regions, languageId, ignoreAttributeValues),
    getLanguageAtPosition: (position: Position) =>
      getLanguageAtPosition(document, regions, position),
    getRegionAtPosition: (position: Position) =>
      getRegionAtPosition(document, regions, position),
    getRegions: () => regions,
    getLanguagesInDocument: () => getLanguagesInDocument(document, regions),
    getImportedScripts: () => [''], // TODO: figure out if actually wanted/needed
  };
}

function createRegion<RegionDataType = any>({
  sourceCodeLocation,
  type,
  attribute,
  attributeName,
  tagName,
  data,
  regionValue,
}: {
  sourceCodeLocation:
    | SaxStream.StartTagToken['sourceCodeLocation']
    | parse5.AttributesLocation[string];
  type: ViewRegionType;
  regionValue?: string;
  attribute?: parse5.Attribute;
  attributeName?: string; // TODO: Remove in favor of `attribute` (one line above)
  tagName?: string;
  data?: RegionDataType;
}): ViewRegionInfo {
  const calculatedStart = sourceCodeLocation?.startOffset;
  const calculatedEnd = sourceCodeLocation?.endOffset;

  return {
    type,
    languageId: type, // [ASSUMPTION]: In offi demo, languageId (css, html), but our regions are aurelai specific (not really languages, thus use the `type` field)
    startOffset: calculatedStart,
    startCol: sourceCodeLocation?.startCol,
    startLine: sourceCodeLocation?.startLine,
    endOffset: calculatedEnd,
    endCol: sourceCodeLocation?.endCol,
    endLine: sourceCodeLocation?.endLine,
    attributeName,
    attributeValue: attribute?.value,
    tagName,
    regionValue,
    data,
  };
}

function getLanguageRanges(
  document: TextDocument,
  regions: ViewRegionInfo[],
  range: Range
): LanguageRange[] {
  const result: LanguageRange[] = [];
  let currentPos = Object.keys(range).length
    ? range.start
    : Position.create(0, 0);
  let currentOffset = Object.keys(range).length
    ? document.offsetAt(range.start)
    : 0;
  const endOffset = Object.keys(range).length
    ? document.offsetAt(range.end)
    : document.getText().length;
  for (const region of regions) {
    if (region.endOffset! > currentOffset && region.startOffset! < endOffset) {
      const start = Math.max(region.startOffset!, currentOffset);
      const startPos = document.positionAt(start);
      if (currentOffset < region.startOffset!) {
        result.push({
          start: currentPos,
          end: startPos,
          languageId: 'html',
        });
      }
      const end = Math.min(region.endOffset!, endOffset);
      const endPos = document.positionAt(end);
      if (end > region.startOffset!) {
        result.push({
          start: startPos,
          end: endPos,
          languageId: region.languageId,
          attributeValue: true,
        });
      }
      currentOffset = end;
      currentPos = endPos;
    }
  }
  if (currentOffset < endOffset) {
    const endPos = Object.keys(range).length
      ? range.end
      : document.positionAt(endOffset);
    result.push({
      start: currentPos,
      end: endPos,
      languageId: 'html',
    });
  }
  return result;
}

function getLanguagesInDocument(
  _document: TextDocument,
  regions: ViewRegionInfo[]
): string[] {
  const result: string[] = [];
  for (const region of regions) {
    if (region.languageId && !result.includes(region.languageId)) {
      result.push(region.languageId);
      if (result.length === 3) {
        return result;
      }
    }
  }
  result.push('html');
  return result;
}

// [2.] Offset in region check
function getLanguageAtPosition(
  document: TextDocument,
  regions: ViewRegionInfo[],
  position: Position
): string | undefined {
  const offset = document.offsetAt(position);

  const potentialRegions = regions.filter((region) => {
    if (region.startOffset! <= offset) {
      if (offset <= region.endOffset!) {
        return Object.keys(region).length;
      }
    }
    return false;
  });

  if (!Object.keys(potentialRegions).length) {
    console.error('embeddedSupport -> getRegionAtPosition -> No Region found');
    return undefined;
  }

  if (potentialRegions.length === 1) {
    return potentialRegions[0].languageId;
  }

  const targetRegion = getSmallestRegion(potentialRegions);

  if (Object.keys(targetRegion).length) {
    return targetRegion.languageId;
  }

  return 'html';
}

export function getRegionFromLineAndCharacter(
  regions: ViewRegionInfo[],
  position: Position
): ViewRegionInfo | undefined {
  const { line, character } = position;

  const targetRegion = regions.find((region) => {
    const { startLine, endLine } = region;
    if (startLine === undefined || endLine === undefined) return false;

    const isSameLine = startLine === endLine;
    if (isSameLine) {
      const { startCol, endCol } = region;
      if (startCol === undefined || endCol === undefined) return false;

      const inBetweenColumns = startCol <= character && character <= endCol;
      return inBetweenColumns;
    }

    const inBetweenLines = startLine <= line && line <= endLine;
    return inBetweenLines;
  });
  return targetRegion;
}

/**
 * const regions = [
 *   { name: "1", startOffset: 100, endOffset: 130 },
 *   { name: "2", startOffset: 120, endOffset: 130 }, <-- smallest
 *   { name: "3", startOffset: 110, endOffset: 130 },
 * ];
 */
function getSmallestRegion(regions: ViewRegionInfo[]): ViewRegionInfo {
  const sortedRegions = regions.sort((regionA, regionB) => {
    if (regionA.startOffset === undefined || regionA.endOffset === undefined)
      return 0;
    if (regionB.startOffset === undefined || regionB.endOffset === undefined)
      return 0;

    const regionAWidth = regionA.startOffset - regionA.endOffset;
    const regionBWidth = regionB.startOffset - regionB.endOffset;

    return regionBWidth - regionAWidth;
  });

  return sortedRegions[0];
}

export function getRegionAtPosition(
  document: TextDocument,
  regions: ViewRegionInfo[],
  position: Position
): ViewRegionInfo | undefined {
  const offset = document.offsetAt(position);

  const potentialRegions = regions.filter((region) => {
    if (region.startOffset! <= offset) {
      if (offset <= region.endOffset!) {
        return Object.keys(region).length;
      }
    }
    return false;
  });

  if (!Object.keys(potentialRegions).length) {
    console.error('embeddedSupport -> getRegionAtPosition -> No Region found');
    return undefined;
  }

  if (potentialRegions.length === 1) {
    return potentialRegions[0];
  }

  const targetRegion = getSmallestRegion(potentialRegions);
  return targetRegion;
}

function getEmbeddedDocument(
  document: TextDocument,
  contents: ViewRegionInfo[],
  languageId: string,
  ignoreAttributeValues: boolean
): TextDocument {
  let currentPos = 0;
  const oldContent = document.getText();
  let result = '';
  const lastSuffix = '';
  for (const c of contents) {
    if (
      c.languageId === languageId &&
      (!ignoreAttributeValues || c.attributeName !== undefined)
    ) {
      result = substituteWithWhitespace(
        result,
        currentPos,
        c.startOffset!,
        oldContent,
        lastSuffix,
        ''
        // getPrefix(c)
      );
      result += oldContent.substring(c.startOffset!, c.endOffset);
      currentPos = c.endOffset!;
      // lastSuffix = getSuffix(c);
    }
  }
  result = substituteWithWhitespace(
    result,
    currentPos,
    oldContent.length,
    oldContent,
    lastSuffix,
    ''
  );
  return TextDocument.create(
    document.uri,
    languageId,
    document.version,
    result
  );
}

// function getPrefix(c: ViewRegionInfo) {
//   if (c.attributeName === undefined) {
//     switch (c.languageId) {
//       case 'css':
//         return `${CSS_STYLE_RULE}{`;
//     }
//   }
//   return '';
// }
// function getSuffix(c: ViewRegionInfo) {
//   if (c.attributeName === undefined) {
//     switch (c.languageId) {
//       case 'css':
//         return '}';
//       case 'javascript':
//         return ';';
//     }
//   }
//   return '';
// }

function substituteWithWhitespace(
  result: string,
  start: number,
  end: number,
  oldContent: string,
  before: string,
  after: string
) {
  let accumulatedWS = 0;
  result += before;
  for (let i = start + before.length; i < end; i++) {
    const ch = oldContent[i];
    if (ch === '\n' || ch === '\r') {
      // only write new lines, skip the whitespace
      accumulatedWS = 0;
      result += ch;
    } else {
      accumulatedWS++;
    }
  }
  result = append(result, ' ', accumulatedWS - after.length);
  result += after;
  return result;
}

function append(result: string, str: string, n: number): string {
  while (n > 0) {
    if (n & 1) {
      result += str;
    }
    n >>= 1;
    str += str;
  }
  return result;
}

// function getAttributeLanguage(attributeName: string): string | null {
//   const match = attributeName.match(/^(style)$|^(on\w+)$/i);
//   if (!match) {
//     return null;
//   }
//   return match[1] ? 'css' : 'javascript';
// }
