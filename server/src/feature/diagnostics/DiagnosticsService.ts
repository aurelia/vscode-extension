import { Diagnostic } from 'vscode-languageserver';

import { getRangeFromRegion } from '../../aot/parser/regions/rangeFromRegion';
import { AbstractRegion } from '../../aot/parser/regions/ViewRegions';

export class DiagnosticsService {
  public static createDiagnosticsFromRegion(
    region: AbstractRegion,
    message: string
  ) {
    const range = getRangeFromRegion(region);
    if (!range) return;
    const diag = Diagnostic.create(range, message);

    return diag;
  }
}
