/* eslint-disable @typescript-eslint/no-explicit-any */
import { kebabCase } from '@aurelia/kernel';
import SaxStream, { TextToken } from 'parse5-sax-parser';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaView, interpolationRegex } from '../../common/constants';
import { Logger } from '../../common/logging/logger';
import { getBindableNameFromAttritute } from '../../common/template/aurelia-attributes';
import { AURELIA_ATTRIBUTES_KEYWORDS } from '../../feature/configuration/DocumentSettings';
import { IAureliaComponent } from '../viewModel/AureliaProgram';
import {
  AbstractRegion,
  AttributeInterpolationRegion,
  AttributeRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ViewRegionInfoV2,
  ValueConverterRegion,
  Optional,
  ImportRegion,
} from './ViewRegions';

const logger = new Logger('RegionParser');
const OBJECT_PLACEHOLDER = '[o]';

interface PrettyOptions<
  Regions extends AbstractRegion[],
  IgnoreKey extends keyof Regions[number]
> {
  ignoreKeys?: IgnoreKey[];
  asTable?: boolean;
  maxColWidth?: number;
}

export class RegionParser {
  public static parse(
    document: TextDocument,
    componentList: Optional<IAureliaComponent, 'viewRegions'>[]
  ): AbstractRegion[] {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });

    /* prettier-ignore */ logger.culogger.debug(['Start document parsing'], { logLevel: 'INFO' });
    const viewRegions: AbstractRegion[] = [];
    const aureliaCustomElementNames = componentList.map(
      (component) => component.componentName
    );
    const documentHasCrlf = document.getText().includes('\r\n');

    let hasTemplateTag = false;

    /**
     * 1. Template Tag x
     * 2. Attributes x
     * 3. Attribute Interpolation x
     * 4. Custom element x
     * 5. repeat.for="" x
     * 6. Value converter region (value | take:10)
     * 7. BindableAttribute x
     * 8. Import
     */
    saxStream.on('startTag', (startTag) => {
      // 0. Prep
      const tagName = startTag.tagName;

      // 1. Template Tag
      const isTemplateTag = tagName === AureliaView.TEMPLATE_TAG_NAME;
      if (isTemplateTag) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasTemplateTag = true;
      }

      const isImportTag = getIsImportOrRequireTag(startTag);
      if (isImportTag) {
        const importRegion = ImportRegion.parse5(startTag);
        if (importRegion) {
          viewRegions.push(importRegion);
        }
        return;
      }

      const attributeRegions: AbstractRegion[] = [];
      startTag.attrs.forEach((attr) => {
        const isAttributeKeyword = AURELIA_ATTRIBUTES_KEYWORDS.some(
          (keyword) => {
            if (keyword === 'ref') {
              return attr.name === keyword;
            } else if (keyword === 'bindable') {
              return attr.name === keyword;
            }
            return attr.name.endsWith(`.${keyword}`);
          }
        );
        const isRepeatFor = attr.name === AureliaView.REPEAT_FOR;

        // 2. Attributes
        if (isAttributeKeyword) {
          // TODO: Are "just" attributes interesting? Or are BindableAttributes enough?
          const attributeRegion = AttributeRegion.parse5(startTag, attr);
          if (attributeRegion) {
            attributeRegions.push(attributeRegion);
          }
        }
        // 5. Repeat for
        else if (isRepeatFor) {
          const repeatForViewRegion = RepeatForRegion.parse5Start(
            startTag,
            attr
          );
          if (!repeatForViewRegion) return;
          viewRegions.push(repeatForViewRegion);
        }
        // 3. Attribute Interpolation
        else {
          if (attr.value.match(interpolationRegex)?.length == null) return;

          const viewRegion = AttributeInterpolationRegion.parse5Interpolation(
            startTag,
            attr,
            null,
            documentHasCrlf
          );
          if (!viewRegion) return;
          viewRegions.push(viewRegion);
        }

        const isValueConverterRegion = attr.value.includes(
          AureliaView.VALUE_CONVERTER_OPERATOR
        );
        // 6. Value converter region
        if (isValueConverterRegion) {
          const valueConverterRegion = ValueConverterRegion.parse5Start(
            startTag,
            attr
          );
          if (valueConverterRegion === undefined) return;
          viewRegions.push(...valueConverterRegion);
        }
      });
      viewRegions.push(...attributeRegions);

      // 4. Custom elements
      const isCustomElement = aureliaCustomElementNames.includes(tagName);
      if (!isCustomElement) {
        return;
      }

      const customElementViewRegion = CustomElementRegion.parse5Start(startTag);
      if (!customElementViewRegion) return;

      // 7. BindableAttribute
      const customElementBindableAttributeRegions: AbstractRegion[] = [];
      const targetComponent = componentList.find(
        (component) => component.componentName === tagName
      );

      startTag.attrs.forEach((attr) => {
        const onlyBindableName = getBindableNameFromAttritute(attr.name);
        const isBindableAttribute = targetComponent?.classMembers?.find(
          (member) => {
            const correctNamingConvetion =
              kebabCase(member.name) === kebabCase(onlyBindableName);
            const is = correctNamingConvetion && member.isBindable;
            return is;
          }
        );
        if (isBindableAttribute == null) return;

        const bindableAttributeRegion = BindableAttributeRegion.parse5Start(
          startTag,
          attr
        );
        if (bindableAttributeRegion) {
          customElementBindableAttributeRegions.push(bindableAttributeRegion);
        }
      });
      customElementViewRegion.data = [...customElementBindableAttributeRegions];

      viewRegions.push(customElementViewRegion);
    });

    saxStream.on('text', (text: TextToken) => {
      if (text.text.trim() === '') return;

      const viewRegion = TextInterpolationRegion.parse5Text(
        text,
        documentHasCrlf
      );
      if (!viewRegion) return;

      viewRegions.push(viewRegion);
    });

    saxStream.on('endTag', (endTag) => {
      const tagName = endTag.tagName;
      const isCustomElement = aureliaCustomElementNames.includes(tagName);
      if (!isCustomElement) return;

      const customElementViewRegion = CustomElementRegion.parse5End(endTag);
      if (!customElementViewRegion) return;

      viewRegions.push(customElementViewRegion);
    });

    saxStream.write(document.getText());

    return viewRegions;
  }

  public static pretty<
    Regions extends AbstractRegion[],
    IgnoreKey extends keyof Regions[number]
  >(
    regions?: AbstractRegion[],
    prettyOptions?: PrettyOptions<Regions, IgnoreKey>
  ) {
    if (!regions) return 'no regions';
    if (regions?.length === 0) return 'no regions';

    const finalResult: Record<string, unknown>[] = [];

    regions.forEach((region) => {
      const prettified: Record<string, unknown> = pickTruthyFields(
        region,
        prettyOptions
      );

      // .data[]
      if (Array.isArray(region.data)) {
        const pretty_data: Record<string, unknown>[] = [];
        region.data.forEach((subRegion) => {
          const pretty_subRegionData = pickTruthyFields(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            subRegion,
            prettyOptions
          );
          pretty_data.push(pretty_subRegionData);
        });
        prettified.data = pretty_data;
      }

      finalResult.push(prettified);
    });

    if (prettyOptions?.asTable !== undefined) {
      const asTable = objectToTable(finalResult, prettyOptions);
      return asTable;
    }

    return finalResult;
  }
}

function objectToTable<
  Regions extends AbstractRegion[],
  IgnoreKey extends keyof Regions[number]
>(
  objectList: Record<string, any>[],
  prettyOptions?: PrettyOptions<Regions, IgnoreKey>
) {
  const EMPTY_PLACEHOLDER = '-';
  const allPossibleKeysSet: Set<string> = new Set();
  objectList.forEach((object) => {
    Object.keys(object).forEach((key) => {
      allPossibleKeysSet.add(key);
    });
  });
  const allPossibleKeys = Array.from(allPossibleKeysSet);
  // allPossibleKeys; /*?*/

  const flattenedRows: string[][] = [];
  objectList.forEach((result) => {
    const withAllKeys: Record<string, string> = {};
    // enrich with all keys, to allow normalized table
    allPossibleKeys.forEach((possibleKey) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      withAllKeys[possibleKey] = result[possibleKey] ?? EMPTY_PLACEHOLDER;
    });

    // collect
    if (typeof withAllKeys.data === 'object') {
      flattenedRows.push(Object.values(withAllKeys));
      if (Array.isArray(withAllKeys.data)) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (<Record<string, any>[]>withAllKeys.data).forEach((datum) => {
          allPossibleKeys.forEach((possibleKey) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            withAllKeys[possibleKey] = datum[possibleKey] ?? EMPTY_PLACEHOLDER;
          });
          flattenedRows.push(Object.values(withAllKeys));
        });
      } else {
        // repeat for and VC
        // flattenedRows.push(Object.values(withAllKeys.data));
      }
      return;
    }
    flattenedRows.push(Object.values(withAllKeys));
  });
  // flattenedRows; /*?*/
  const final = [allPossibleKeys, ...flattenedRows] as string[][];

  // find max in each column
  const maxHeader = allPossibleKeys.map((headerColumn) => headerColumn.length);
  const maxTracker = maxHeader;
  flattenedRows.forEach((rowEntry) => {
    rowEntry.forEach((rowValue, index) => {
      maxTracker[index] = Math.max(maxTracker[index], rowValue.length ?? 0);
    });
  });

  const asTable = final.map((row) => {
    const padded = row.map((entry, index) => {
      let finalEntry = entry;
      if (!entry) finalEntry = '-';
      if (typeof entry !== 'string') finalEntry = OBJECT_PLACEHOLDER;

      if (prettyOptions?.maxColWidth !== undefined) {
        finalEntry = finalEntry.substring(0, prettyOptions.maxColWidth);
      }
      const padWith = Math.min(
        prettyOptions?.maxColWidth ?? Infinity,
        maxTracker[index]
      );
      finalEntry = finalEntry.replace('\n', '[nl]');
      // maxTracker; /*?*/
      return finalEntry?.padEnd(padWith, ' ');
    });
    return padded.join(' | ');
  });

  return asTable;
}

export function prettyTable<
  Regions extends AbstractRegion[],
  IgnoreKey extends keyof Regions[number]
>(
  allPossibleKeys: string[],
  flattenedRows: string[][],
  prettyOptions?: PrettyOptions<Regions, IgnoreKey>
) {
  const final = [allPossibleKeys, ...flattenedRows];

  // find max in each column
  const maxHeader = allPossibleKeys.map((headerColumn) => headerColumn.length);
  const maxTracker = maxHeader;
  flattenedRows.forEach((rowEntry) => {
    rowEntry.forEach((rowValue, index) => {
      maxTracker[index] = Math.max(maxTracker[index], rowValue.length ?? 0);
    });
  });

  const asTable = final.map((row) => {
    const padded = row.map((entry, index) => {
      let finalEntry = entry;
      if (!entry) finalEntry = '-';
      if (typeof entry !== 'string') finalEntry = OBJECT_PLACEHOLDER;

      if (prettyOptions?.maxColWidth !== undefined) {
        finalEntry = finalEntry.substring(0, prettyOptions.maxColWidth);
      }
      const padWith = Math.min(
        prettyOptions?.maxColWidth ?? Infinity,
        maxTracker[index]
      );
      return finalEntry?.padEnd(padWith, ' ');
    });
    return padded.join(' | ');
  });

  return asTable;
}

function pickTruthyFields(
  anyObject: Record<string, any>,
  prettyOptions?: { ignoreKeys?: any[] }
) {
  const truthyFields: Record<string, any> = {};

  Object.entries(anyObject ?? {}).forEach(([key, value]) => {
    const regionInfo = value as ViewRegionInfoV2;
    if (regionInfo === undefined) return;
    if (prettyOptions?.ignoreKeys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const shouldIgnoreKey = prettyOptions.ignoreKeys.find(
        (ignore) => ignore === key
      );
      if (shouldIgnoreKey !== undefined) return;
    }

    truthyFields[key] = regionInfo;
  });

  return truthyFields;
}

function getIsImportOrRequireTag(startTag: SaxStream.StartTagToken) {
  const isImport = startTag.tagName === AureliaView.IMPORT;
  const isRequire = startTag.tagName === AureliaView.REQUIRE;
  const isTargetTag = isImport || isRequire;
  return isTargetTag;
}

// const path =
//   // '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/scoped-for-testing/src/index.html';
//   // '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/scoped-for-testing/src/view/custom-element/custom-element.html';
//   '/home/hdn/coding/repos/vscode-extension/tests/testFixture/scoped-for-testing/src/view/custom-element/custom-element.html';
// const document = TextDocumentUtils.createHtmlFromPath(path);
// const result = RegionParser.parse(document, [
//   // @ts-ignore
//   { componentName: 'custom-element' },
// ]);

// const visitor: IViewRegionsVisitor = {
//   visitValueConverter(region) {
//     region.regionValue; /*?*/
//   },
//   visitAttributeInterpolation(region) {
//     region.regionValue; /*?*/
//   },
// };

// result.forEach((res) => res.accept(visitor));
// RegionParser.pretty(result, { ignoreKeys: ['sourceCodeLocation'] }); /*?*/
//  result/*?*/
