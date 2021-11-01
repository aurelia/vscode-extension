import {
  ExpressionKind,
  ExpressionType,
  Interpolation,
  parseExpression,
} from '@aurelia/runtime';
import * as parse5 from 'parse5';
import SaxStream from 'parse5-sax-parser';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaView } from '../../common/constants';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { Logger } from '../../common/logging/logger';
import { ParseExpressionUtil } from '../../common/parseExpression/ParseExpressionUtil';
import { AURELIA_ATTRIBUTES_KEYWORDS } from '../../feature/configuration/DocumentSettings';
import {
  ViewRegionInfo,
  ViewRegionType,
} from '../embeddedLanguages/embeddedSupport';
import { IAureliaComponent } from '../viewModel/AureliaProgram';
import { findRegionsByWordV2 } from './findSpecificRegion';
import {
  AbstractRegion,
  AttributeInterpolationRegion,
  AttributeRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ViewRegionInfoV2,
} from './ViewRegions';

const logger = new Logger('RegionParser');

export class RegionParser {
  static parse(
    document: TextDocument,
    componentList: IAureliaComponent[]
  ): AbstractRegion[] {
    const saxStream = new SaxStream({ sourceCodeLocationInfo: true });

    /* prettier-ignore */ logger.culogger.debug(['Start document parsing'], { logLevel: 'INFO' });
    const viewRegions: AbstractRegion[] = [];
    const aureliaCustomElementNames = componentList.map(
      (component) => component.componentName
    );
    const interpolationRegex = /\$(?:\s*)\{(?!\s*`)(.*?)\}/g;

    let hasTemplateTag = false;

    /**
     * 1. Template Tag x
     * 2. Attributes x
     * 3. Attribute Interpolation x
     * 4. Custom element x
     * 5. repeat.for="" x
     * 6. Value converter region (value | take:10)
     * 7. BindableAttribute x
     */
    // eslint-disable-next-line max-lines-per-function
    saxStream.on('startTag', (startTag) => {
      // 0. Prep
      const tagName = startTag.tagName;

      // 1. Template Tag
      const isTemplateTag = tagName === AureliaView.TEMPLATE_TAG_NAME;
      if (isTemplateTag) {
        hasTemplateTag = true;
      }

      const customElementBindableAttributeRegions: AbstractRegion[] = [];
      startTag.attrs.forEach((attr) => {
        const isAttributeKeyword = AURELIA_ATTRIBUTES_KEYWORDS.some(
          (keyword) => {
            return attr.name.includes(keyword);
          }
        );
        const isRepeatFor = attr.name === AureliaView.REPEAT_FOR;

        // 2. Attributes
        if (isAttributeKeyword) {
          const viewRegion = AttributeRegion.parse5(startTag, attr);
          if (viewRegion) {
            viewRegions.push(viewRegion);
          }

          // 7. BindableAttribute
          const bindableAttributeRegion = BindableAttributeRegion.parse5Start(
            startTag,
            attr
          );
          if (bindableAttributeRegion) {
            customElementBindableAttributeRegions.push(bindableAttributeRegion);
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
          let interpolationMatch;
          while ((interpolationMatch = interpolationRegex.exec(attr.value))) {
            const viewRegion = AttributeInterpolationRegion.parse5Interpolation(
              startTag,
              attr,
              interpolationMatch
            );
            if (!viewRegion) return;
            viewRegions.push(viewRegion);
          }
        }

        const isValueConverterRegion = attr.value.includes(
          AureliaView.VALUE_CONVERTER_OPERATOR
        );
        // 6. Value converter region
        if (isValueConverterRegion) {
          const parsed = parseExpression(
            attr.value,
            ExpressionType.Interpolation
          );
          const accessScopes = ParseExpressionUtil.getAllExpressionsOfKind(
            parsed,
            ExpressionKind.ValueConverter
          );
          parsed; /*?*/
        }
      });

      // 4. Custom elements
      const isCustomElement = aureliaCustomElementNames.includes(tagName);
      if (!isCustomElement) return;

      const customElementViewRegion = CustomElementRegion.parse5Start(startTag);
      if (!customElementViewRegion) return;

      customElementViewRegion.data = [...customElementBindableAttributeRegions];

      viewRegions.push(customElementViewRegion);
    });

    saxStream.on('text', (text) => {
      let interpolationMatch;
      while ((interpolationMatch = interpolationRegex.exec(text.text))) {
        const viewRegion = TextInterpolationRegion.parse5Text(
          text,
          interpolationMatch
        );
        if (!viewRegion) return;
        viewRegions.push(viewRegion);
      }
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

  static pretty<
    Regions extends AbstractRegion[],
    IgnoreKey extends keyof Regions[number]
  >(regions: AbstractRegion[], prettyOptions?: { ignoreKeys?: IgnoreKey[] }) {
    const finalResult: Record<string, any>[] = [];

    regions.forEach((region) => {
      const prettified: Record<string, any> = pickTruthyFields(
        region,
        prettyOptions
      );

      // .data[]
      if (Array.isArray(region.data)) {
        const pretty_data: Record<string, any>[] = [];
        region.data.forEach((subRegion) => {
          const pretty_subRegionData = pickTruthyFields(
            subRegion,
            prettyOptions
          );
          pretty_data.push(pretty_subRegionData);
        });
        prettified.data = pretty_data;
      }

      finalResult.push(prettified);
    });

    return finalResult;
  }
}

const path =
  // '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/scoped-for-testing/src/index.html';
  '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/scoped-for-testing/src/view/custom-element/custom-element.html';
const document = TextDocumentUtils.createHtmlFromPath(path);
const result = RegionParser.parse(document, [
  // @ts-ignore
  { componentName: 'custom-element' },
]);
RegionParser.pretty(result, { ignoreKeys: ['sourceCodeLocation'] }); /*?*/

function pickTruthyFields(
  anyObject: Record<string, any>,
  prettyOptions?: { ignoreKeys?: unknown[] }
) {
  const truthyFields: Record<string, any> = {};

  Object.entries(anyObject ?? {}).forEach(([key, value]) => {
    const regionInfo = value as ViewRegionInfoV2;
    if (regionInfo === undefined) return;
    if (prettyOptions?.ignoreKeys) {
      const shouldIgnoreKey = prettyOptions.ignoreKeys.find(
        (ignore) => ignore === key
      );
      if (shouldIgnoreKey) return;
    }

    truthyFields[key] = regionInfo;
  });

  return truthyFields;
}
