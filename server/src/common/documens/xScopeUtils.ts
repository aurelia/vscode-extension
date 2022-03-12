import { ViewRegionInfoV2 } from '../../aot/parser/regions/ViewRegions';

export class XScopeUtils {
  public static getScopeByOffset(
    scopes: ViewRegionInfoV2['accessScopes'],
    offset: number | undefined
  ) {
    if (scopes == null) return;
    if (offset == null) return;

    const result = scopes.find((scope) => {
      const { start, end } = scope.nameLocation;
      const afterStart = start <= offset;
      const beforeEnd = offset <= end;
      const inBetween = afterStart && beforeEnd;

      return inBetween;
    });

    return result;
  }
}
