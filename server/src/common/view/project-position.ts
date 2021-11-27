import { Position } from 'vscode-languageserver-textdocument';

interface LocationLike {
  startLine?: number;
  startCol?: number;
  endLine?: number;
  endCol?: number;
}

/**
 * Project 2dim line x character to a 1dim value
 */
export function projectLocation(location: LocationLike): number | undefined {
  const line = location.startLine ?? location.endLine;
  const character = location.startCol ?? location.endCol;

  if (line == null) return;
  if (character == null) return;

  const projection = projectPosition({ line, character });
  return projection;
}

/**
 * Project 2dim line x character to a 1dim value
 */
export function projectPosition(position: Position) {
  const projection = position.line * 100000 + position.character;
  return projection;
}
