import { Position } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver-types';

import { PositionUtils } from '../documens/PositionUtils';

export class DiagnosticService {
  public static filterDiagnosticsAtPosition(
    diagnostics: Diagnostic[] | undefined,
    startPosition: Position
  ) {
    const hasDiagnosticAtPosition = diagnostics?.filter((diagnostic) => {
      const { start, end } = diagnostic.range;
      const result = PositionUtils.isIncluded(start, end, startPosition);
      return result;
    });

    return hasDiagnosticAtPosition;
  }
}
