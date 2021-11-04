import { RenameLocation } from 'ts-morph';
import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AbstractRegion, RepeatForRegion } from './ViewRegions';

export function getRangeFromDocumentOffsets(
  document: TextDocument,
  startOffset: number | undefined,
  endOffset: number | undefined
) {
  if (!startOffset) return;
  if (!endOffset) return;

  const startPosition = document.positionAt(startOffset);
  const endPosition = document.positionAt(endOffset - 1);
  const range = Range.create(startPosition, endPosition);
  if (document.uri.includes('custom-element.ts')) {
    startOffset; /* ? */
    range; /* ? */
  }
  return range;
}

export function getRangeFromRegion(
  region: AbstractRegion,
  document?: TextDocument
): Range | undefined {
  let range;
  if (document) {
    range = getRangeFromRegionViaDocument(region, document);
  } else {
    range = getRangeFromStandardRegion(region, range);
  }

  return range;
}

function getRangeFromRegionViaDocument(
  region: AbstractRegion,
  document: TextDocument
) {
  if (!region.sourceCodeLocation) return;
  const { sourceCodeLocation } = region;
  const { startOffset } = sourceCodeLocation;
  const { endOffset } = sourceCodeLocation;
  let range;

  if (RepeatForRegion.is(region)) {
    range = getRangeFromRepeatForRegion(region, document);
  } else {
    range = getRangeFromDocumentOffsets(document, startOffset, endOffset);
  }

  return range;
}

function getRangeFromStandardRegion(region: AbstractRegion, range: any) {
  if (!region.sourceCodeLocation) return;
  const { sourceCodeLocation } = region;
  const { startCol } = sourceCodeLocation;
  const { startLine } = sourceCodeLocation;
  const { endCol } = sourceCodeLocation;
  const { endLine } = sourceCodeLocation;

  const startPosition = Position.create(startLine, startCol);
  const endPosition = Position.create(endLine, endCol);
  range = Range.create(startPosition, endPosition);

  return range;
}

function getRangeFromRepeatForRegion(
  repeatForRegion: RepeatForRegion,
  document: TextDocument
): any {
  if (!repeatForRegion.data) return;

  const range = getRangeFromDocumentOffsets(
    document,
    repeatForRegion.data.iterableStartOffset,
    repeatForRegion.data.iterableEndOffset - 1
  );

  return range;
}

export function getRangeFromLocation(location: RenameLocation) {
  const textSpan = location.getTextSpan();
  const locationSourceFile = location.getSourceFile();
  const startLocation = locationSourceFile.getLineAndColumnAtPos(
    textSpan.getStart()
  );
  const startPosition = Position.create(
    startLocation.line - 1,
    startLocation.column - 1
  );
  const endLocation = locationSourceFile.getLineAndColumnAtPos(
    textSpan.getEnd()
  );
  const endPosition = Position.create(
    endLocation.line - 1,
    endLocation.column - 1
  );
  const range = Range.create(startPosition, endPosition);
  return range;
}

export function getStartTagNameRange(
  region: AbstractRegion,
  document: TextDocument
) {
  if (!region.sourceCodeLocation) return;
  const { sourceCodeLocation } = region;
  const { startOffset } = sourceCodeLocation;
  const { tagName } = region;

  const endOffset = startOffset + tagName.length + 1; // + 1, magic, because of all the offsetting we have to fix;

  const range = getRangeFromDocumentOffsets(document, startOffset, endOffset);

  return range;
}
