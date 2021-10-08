import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  parseDocumentRegions,
  RepeatForRegionData,
  ViewRegionInfo,
  ViewRegionType,
} from '../../feature/embeddedLanguages/embeddedSupport';
import { AureliaProgram } from '../../viewModel/AureliaProgram';

type Uri = string;
type RegionsLookUp = Record<Uri, ViewRegionInfo[]>;

export async function findAllBindableRegions(
  aureliaProgram: AureliaProgram,
  bindableName: string
): Promise<RegionsLookUp> {
  const regionsLookUp: RegionsLookUp = {};

  // 1. Find Custom Elements with target Bindable
  const componentList = aureliaProgram.getComponentList();
  await Promise.all(
    componentList.map(async (component) => {
      const path = component.viewFilePath!;
      const uri = pathToFileURL(path).toString();
      const content = fs.readFileSync(path, 'utf-8');
      const document = TextDocument.create(uri, 'html', 0, content);
      if (!document) return;
      // 1.1 Parse document, and find all Custom Element regions
      const regions = await parseDocumentRegions(document, componentList);
      const customElementRegions = getRegionsOfType<ViewRegionInfo[]>(
        regions,
        ViewRegionType.CustomElement
      );
      // 1.2 Find all Custom Element with target bindable
      const customElementRegionsWithTargetBindable = customElementRegions.forEach(
        (region) => {
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
        }
      );
      // 1.3 TODO: Multiple CE can have same attribute name

      return customElementRegionsWithTargetBindable;
    })
  );

  return regionsLookUp;
}

export async function findRegionsWithValue(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  sourceWord: string
): Promise<ViewRegionInfo[]> {
  const componentList = aureliaProgram.getComponentList();
  const regions = await parseDocumentRegions(document, componentList);

  const targetRegions = regions.filter((region) => {
    // 1. repeat-for regions
    if (region.type === ViewRegionType.RepeatFor) {
      const repeatForRegion = region as ViewRegionInfo<RepeatForRegionData>;
      const isTargetIterable =
        repeatForRegion.data?.iterableName === sourceWord;

      return isTargetIterable;
    }

    // 2. default case: .regionValue
    const isDefault = region.regionValue === sourceWord;
    return isDefault;
  });

  return targetRegions;
}

function getRegionsOfType<RegionDataType>(
  regions: ViewRegionInfo<RegionDataType>[],
  regionType: ViewRegionType
) {
  return regions.filter((region) => region.type === regionType);
}
