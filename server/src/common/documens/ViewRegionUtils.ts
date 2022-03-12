import { Position } from 'vscode-languageserver-types';

import {
  AbstractRegion,
  AttributeInterpolationRegion,
  AttributeRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  ImportRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ValueConverterRegion,
  ViewRegionType,
} from '../../aot/parser/regions/ViewRegions';
import { OffsetUtils } from './OffsetUtils';
import { PositionUtils } from './PositionUtils';

/* prettier-ignore */
export type TypeToClass<TargetType extends ViewRegionType> =
  TargetType extends ViewRegionType.Attribute ? AttributeRegion :
    TargetType extends ViewRegionType.AttributeInterpolation ? AttributeInterpolationRegion :
      TargetType extends ViewRegionType.BindableAttribute ? BindableAttributeRegion :
        TargetType extends ViewRegionType.CustomElement ? CustomElementRegion :
          TargetType extends ViewRegionType.Import ? ImportRegion :
            TargetType extends ViewRegionType.RepeatFor ? RepeatForRegion :
              TargetType extends ViewRegionType.TextInterpolation ? TextInterpolationRegion :
                TargetType extends ViewRegionType.ValueConverter ? ValueConverterRegion :
never;

export class ViewRegionUtils {
  public static getRegionsOfType<
    TargetKind extends ViewRegionType,
    ReturnType extends TypeToClass<TargetKind>
  >(regions: AbstractRegion[], regionType: TargetKind): ReturnType[] {
    const targetRegions = regions.filter(
      (region) => region.type === regionType
    );
    return targetRegions as ReturnType[];
  }

  public static getTargetRegionByLine(regions: AbstractRegion[], line: string) {
    const result = regions.find((region) => {
      return region.sourceCodeLocation.startLine === Number(line);
    });
    return result;
  }
  public static getManyTargetsRegionByLine(
    regions: AbstractRegion[],
    line: string
  ) {
    const result = regions.filter((region) => {
      const isSameLine = region.sourceCodeLocation.startLine === Number(line);
      if (isSameLine) {
        // Excluded TextInterpolation regions, because text regions start on "line before" in parse5
        if (region.textValue?.startsWith('\n')) {
          return false;
        }
      }
      return isSameLine;
    });
    return result;
  }

  public static findRegionAtPosition(
    regions: AbstractRegion[],
    position: Position
  ) {
    // RegionParser.pretty(regions, {
    //   asTable: true,
    //   ignoreKeys: [
    //     'sourceCodeLocation',
    //     'languageService',
    //     'subType',
    //     'tagName',
    //   ],
    //   maxColWidth: 12,
    // }); /*?*/
    let targetRegion: AbstractRegion | undefined;

    regions.find((region) => {
      let possibleRegion = region;
      if (CustomElementRegion.is(region)) {
        const subTarget = this.findRegionAtPosition(region.data, position);
        if (subTarget) {
          possibleRegion = subTarget;
        }
      }

      const start = possibleRegion.getStartPosition();
      const end = possibleRegion.getEndPosition();
      const isIncluded = PositionUtils.isIncluded(start, end, position);

      if (isIncluded) {
        targetRegion = possibleRegion;
      }

      return isIncluded;
    });
    if (!targetRegion) return;

    return targetRegion;
  }

  public static findRegionAtOffset(regions: AbstractRegion[], offset: number) {
    const possibleRegions: AbstractRegion[] = [];

    regions.forEach((region) => {
      const possibleRegion = region;

      // CustomElementRegion
      if (CustomElementRegion.is(region)) {
        const subTarget = this.findRegionAtOffset(region.data, offset);
        if (subTarget !== undefined) {
          possibleRegions.push(subTarget);
        }

        if (possibleRegion.startTagLocation) {
          const { startOffset, endOffset } = possibleRegion.startTagLocation;
          const isIncluded = OffsetUtils.isIncluded(
            startOffset,
            endOffset,
            offset
          );

          if (isIncluded) {
            possibleRegions.push(region);
          }
        }
      }

      const { startOffset, endOffset } = possibleRegion.sourceCodeLocation;
      const isIncluded = OffsetUtils.isIncluded(startOffset, endOffset, offset);
      if (isIncluded) {
        possibleRegions.push(region);
      }
    });

    const targetRegion = findSmallestRegionAtOffset(possibleRegions, offset);

    // if (targetRegion === undefined) {
    //   targetRegion = AureliaHtmlRegion.create();
    // }

    return targetRegion;
  }

  public static isInCustomElementStartTag(
    region: AbstractRegion,
    offset: number
  ) {
    if (!CustomElementRegion.is(region)) return;

    const { startOffset, endOffset } = region.sourceCodeLocation;
    const afterStart = startOffset <= offset;
    const beforeEnd = offset <= endOffset;
    const is = afterStart && beforeEnd;

    return is;
  }
}

/**
 * {} - parent
 * [] - child
 * Assumption: Child always fully included in parent.
 *
 * {[        |     ]}
 * {     [   |     ]}
 * {     [   |  ]   }
 * {[        |   ]  }
 */
function findSmallestRegionAtOffset(regions: AbstractRegion[], offset: number) {
  /** Determine how small a region is. */
  let smallestValue = Infinity;
  let smallestRegionIndex = 0;
  regions.forEach((region, index) => {
    if (region.sourceCodeLocation === undefined) return;
    const { startOffset, endOffset } = region.sourceCodeLocation;

    if (startOffset > offset) return;
    if (offset > endOffset) return;

    const startDelta = offset - startOffset;
    const endDelta = endOffset - offset;
    const deltaLength = endDelta + startDelta;

    if (smallestValue > deltaLength) {
      smallestValue = deltaLength;
      smallestRegionIndex = index;
    }
  });

  const result = regions[smallestRegionIndex];
  return result;
}
