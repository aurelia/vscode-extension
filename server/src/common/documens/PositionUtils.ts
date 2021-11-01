import { Position } from 'vscode-languageserver-textdocument';

export class PositionUtils {
  static isIncluded(start: Position, end: Position, target: Position) {
    const projectedStart = PositionUtils.projectPosition(start);
    const projectedEnd = PositionUtils.projectPosition(end);
    const projectedSources = PositionUtils.projectPosition(target);
    const isIncluded =
      projectedStart <= projectedSources && projectedSources <= projectedEnd;

    return isIncluded;
  }

  /**
   * Project 2dim line x character to a 1dim value
   */
  static projectPosition(position: Position) {
    const projection = position.line * 100000 + position.character;
    return projection;
  }
}
