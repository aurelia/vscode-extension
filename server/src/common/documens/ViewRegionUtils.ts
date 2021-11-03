import { Position } from 'vscode-languageserver-types';
import {
  ViewRegionInfo,
  ViewRegionType,
} from '../../core/embeddedLanguages/embeddedSupport';
import {
  AbstractRegion,
  AttributeInterpolationRegion,
  AttributeRegion,
  BindableAttributeRegion,
  CustomElementRegion,
  RepeatForRegion,
  TextInterpolationRegion,
  ValueConverterRegion,
} from '../../core/regions/ViewRegions';
import { PositionUtils } from './PositionUtils';

/* prettier-ignore */
export type TypeToClass<TargetType extends ViewRegionType> =
  TargetType extends ViewRegionType.Attribute ? AttributeRegion :
    TargetType extends ViewRegionType.AttributeInterpolation ? AttributeInterpolationRegion :
      TargetType extends ViewRegionType.BindableAttribute ? BindableAttributeRegion :
        TargetType extends ViewRegionType.CustomElement ? CustomElementRegion :
          TargetType extends ViewRegionType.RepeatFor ? RepeatForRegion :
            TargetType extends ViewRegionType.TextInterpolation ? TextInterpolationRegion :
              TargetType extends ViewRegionType.ValueConverter ? ValueConverterRegion :
never;

export class ViewRegionUtils {
  static getRegionsOfType<
    TargetKind extends ViewRegionType,
    ReturnType extends TypeToClass<TargetKind>
  >(regions: AbstractRegion[], regionType: TargetKind): ReturnType[] {
    const targetRegions = regions.filter(
      (region) => region.type === regionType
    );
    return targetRegions as ReturnType[];
  }

  static getTargetRegion(regions: AbstractRegion[], line: string) {
    const result = regions.find((region) => {
      return region.sourceCodeLocation.startLine === Number(line);
    });
    return result;
  }

  static findRegionAtPosition(regions: AbstractRegion[], position: Position) {
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
}

// ViewRegionUtils.regionVisitor([ViewRegionType.CustomElement, (region) => {}]);
