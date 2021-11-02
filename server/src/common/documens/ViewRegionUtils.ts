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

  static getRegionFromPosition(region: ViewRegionInfo, position: Position) {}

  static regionVisitor(region: ViewRegionInfo, position: Position) {}
}

// ViewRegionUtils.regionVisitor([ViewRegionType.CustomElement, (region) => {}]);
