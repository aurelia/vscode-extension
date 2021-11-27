import { Position } from 'vscode-languageserver';

import { projectPosition } from '../view/project-position';

export class PositionUtils {
  public static convertToZeroIndexed(line: number, character: number) {
    const position = Position.create(line - 1, character - 1);
    return position;
  }

  public static isIncluded(start: Position, end: Position, target: Position) {
    const projectedStart = projectPosition(start);
    const projectedEnd = projectPosition(end);
    const projectedSources = projectPosition(target);
    const isIncluded =
      projectedStart <= projectedSources && projectedSources <= projectedEnd;

    return isIncluded;
  }
}
