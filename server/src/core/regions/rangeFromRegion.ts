import { RenameLocation } from 'ts-morph';
import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  ViewRegionInfo,
  ViewRegionType,
  RepeatForRegionData,
} from '../embeddedLanguages/embeddedSupport';

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
  return range;
}

export function getRangeFromRegion(
  region: ViewRegionInfo,
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
  region: ViewRegionInfo,
  document: TextDocument
) {
  if (!region.startOffset) return;
  if (!region.endOffset) return;

  let range;

  if (region.type === ViewRegionType.RepeatFor) {
    range = getRangeFromRepeatForRegion(region, document);
  } else {
    range = getRangeFromDocumentOffsets(
      document,
      region.startOffset,
      region.endOffset
    );
  }

  return range;
}

function getRangeFromStandardRegion(region: ViewRegionInfo, range: any) {
  if (!region.startCol) return;
  if (!region.startLine) return;
  if (!region.endCol) return;
  if (!region.endLine) return;

  const startPosition = Position.create(
    region.startLine - 1,
    region.startCol - 1
  );
  const endPosition = Position.create(region.endLine - 1, region.endCol - 1);
  range = Range.create(startPosition, endPosition);

  return range;
}

function getRangeFromRepeatForRegion(
  region: ViewRegionInfo,
  document: TextDocument
): any {
  const repeatForRegion = region as ViewRegionInfo<RepeatForRegionData>;
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
  region: ViewRegionInfo,
  document: TextDocument
) {
  const { startCol, startOffset, startLine, tagName } = region;
  if (!startCol) return;
  if (!startOffset) return;
  if (!startLine) return;
  if (!tagName) return;

  const finalStartOffset = startOffset + 1; // +1 for "<" of tag
  const endOffset = finalStartOffset + tagName.length + 1; // + 1, magic, because of all the offsetting we have to fix;

  const range = getRangeFromDocumentOffsets(
    document,
    finalStartOffset,
    endOffset
  );

  return range;
}
