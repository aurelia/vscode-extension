import * as fs from 'fs';
import { pathToFileURL } from 'url';

import {
  ExpressionKind,
  ExpressionType,
  Interpolation,
  parseExpression,
} from '@aurelia/runtime';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  TypeToClass,
  ViewRegionUtils,
} from '../../common/documens/ViewRegionUtils';
import { ParseExpressionUtil } from '../../common/parseExpression/ParseExpressionUtil';
import { AureliaProgram } from '../viewModel/AureliaProgram';
import { RegionParser } from './RegionParser';
import { AbstractRegion, RepeatForRegion, ViewRegionType } from './ViewRegions';

type Uri = string;
type RegionsLookUp = Record<Uri, AbstractRegion[]>;

export async function findAllBindableAttributeRegions(
  aureliaProgram: AureliaProgram,
  bindableName: string
): Promise<RegionsLookUp> {
  const regionsLookUp: RegionsLookUp = {};

  // 1. Find Custom Elements with target Bindable
  const componentList = aureliaProgram.aureliaComponents.getAll();
  await Promise.all(
    componentList.map(async (component) => {
      const path = component.viewFilePath!;
      const uri = pathToFileURL(path).toString();
      const content = fs.readFileSync(path, 'utf-8');
      const document = TextDocument.create(uri, 'html', 0, content);
      if (document === undefined) return;
      // 1.1 Parse document, and find all Custom Element regions
      // const regions = await parseDocumentRegions(document, componentList);
      const regions = RegionParser.parse(document, componentList);
      // const customElementRegions = getRegionsOfType<ViewRegionInfoV2[]>(
      const customElementRegions = ViewRegionUtils.getRegionsOfType(
        regions,
        ViewRegionType.CustomElement
      );
      // 1.2 Find all Custom Element with target bindable
      const customElementRegionsWithTargetBindable =
        customElementRegions.forEach((region) => {
          const targetBindableAttribute = region.data?.find((attribute) => {
            if (attribute.regionValue === bindableName) {
              // 1.2.1 Init
              if (regionsLookUp[uri] === undefined) {
                regionsLookUp[uri] = [];
              }
              // 1.2.2 Gather all BindableAttribute Regions
              regionsLookUp[uri].push(attribute);
              return true;
            }
            return false;
          });

          return targetBindableAttribute;
        });
      // 1.3 TODO: Multiple CE can have same attribute name

      return customElementRegionsWithTargetBindable;
    })
  );

  return regionsLookUp;
}

export async function forEachRegionOfType<RegionType extends ViewRegionType>(
  aureliaProgram: AureliaProgram,
  regionType: RegionType,
  forEachRegionsCallback: (
    region: TypeToClass<RegionType>,
    // region: AbstractRegion,
    document: TextDocument
  ) => void
): Promise<RegionsLookUp> {
  const regionsLookUp: RegionsLookUp = {};

  // 1. Find Custom Elements with target Bindable
  const componentList = aureliaProgram.aureliaComponents.getAll();
  await Promise.all(
    componentList.map(async (component) => {
      const path = component.viewFilePath!;
      const uri = pathToFileURL(path).toString();
      const content = fs.readFileSync(path, 'utf-8');
      const document = TextDocument.create(uri, 'html', 0, content);
      if (document === undefined) return;
      // 1.1 Parse document, and find all Custom Element regions
      const regions = RegionParser.parse(document, componentList);
      const finalRegions = ViewRegionUtils.getRegionsOfType(
        regions,
        regionType
      );
      finalRegions.forEach((region) => {
        forEachRegionsCallback(region, document);
      });
    })
  );

  return regionsLookUp;
}

export async function findRegionsByWord(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  sourceWord: string
): Promise<AbstractRegion[]> {
  const componentList = aureliaProgram.aureliaComponents.getAll();
  const regions = RegionParser.parse(document, componentList);

  const targetRegions = regions.filter((region) => {
    // 1. default case: .regionValue
    const isDefault = region.regionValue === sourceWord;
    if (isDefault) {
      return true;
    }

    // 2. repeat-for regions
    else if (RepeatForRegion.is(region)) {
      return isRepeatForIncludesWord(region, sourceWord);
    }

    // 3. Expressions
    let expressionType;
    // Interpolation
    if (
      region.type === ViewRegionType.AttributeInterpolation ||
      region.type === ViewRegionType.TextInterpolation
    ) {
      expressionType = ExpressionType.Interpolation;
    }
    // None
    else if (region.type === ViewRegionType.Attribute) {
      expressionType = ExpressionType.None;
    }

    const parseInput =
      region.textValue ?? region.attributeValue ?? region.regionValue ?? '';
    // expressionType; /*?*/
    // region.type; /*?*/
    // parseInput; /*?*/
    // region; /*?*/
    if (parseInput === '') return false;

    const parsed = parseExpression(
      parseInput,
      expressionType
    ) as unknown as Interpolation; // Cast because, pretty sure we only get Interpolation as return in our use cases
    const accessScopes = ParseExpressionUtil.getAllExpressionsOfKind(parsed, [
      ExpressionKind.AccessScope,
    ]);
    const hasSourceWordInScope = accessScopes.find(
      (accessScope) => accessScope.name === sourceWord
    );
    return hasSourceWordInScope;
  });

  return targetRegions;
}

export async function findRegionsByWordV2(
  regions: AbstractRegion[],
  sourceWord: string
): Promise<AbstractRegion[]> {
  const targetRegions = regions.filter((region) => {
    // 1. default case: .regionValue
    const isDefault = region.regionValue === sourceWord;
    if (isDefault) {
      return true;
    }

    // 2. repeat-for regions
    else if (RepeatForRegion.is(region)) {
      return isRepeatForIncludesWord(region, sourceWord);
    }

    // 3. Expressions
    let expressionType;
    // Interpolation
    if (
      region.type === ViewRegionType.AttributeInterpolation ||
      region.type === ViewRegionType.TextInterpolation
    ) {
      expressionType = ExpressionType.Interpolation;
    }
    // None
    else if (region.type === ViewRegionType.Attribute) {
      expressionType = ExpressionType.None;
    }

    const parseInput = region.textValue ?? region.attributeValue ?? '';
    const parsed = parseExpression(
      parseInput,
      expressionType
    ) as unknown as Interpolation; // Cast because, pretty sure we only get Interpolation as return in our use cases
    const accessScopes = ParseExpressionUtil.getAllExpressionsOfKind(parsed, [
      ExpressionKind.AccessScope,
    ]);
    const hasSourceWordInScope = accessScopes.find(
      (accessScope) => accessScope.name === sourceWord
    );
    return hasSourceWordInScope;
  });

  return targetRegions;
}

function isRepeatForIncludesWord(
  repeatForRegion: RepeatForRegion,
  sourceWord: string
) {
  const isTargetIterable = repeatForRegion.data.iterableName === sourceWord;

  return isTargetIterable;
}

export function getRegionsOfType(
  regions: AbstractRegion[],
  regionType: ViewRegionType
) {
  return regions.filter((region) => region.type === regionType);
}
