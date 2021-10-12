import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  ViewRegionInfo,
  ViewRegionType,
  RepeatForRegionData,
} from '../embeddedLanguages/embeddedSupport';

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

  let startPosition;
  let endPosition;
  let range;

  if (region.type === ViewRegionType.RepeatFor) {
    range = getRangeFromRepeatForRegion(region, document);
  } else {
    startPosition = document.positionAt(region.startOffset);
    endPosition = document.positionAt(region.endOffset - 1);
    range = Range.create(startPosition, endPosition);
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

  const startPosition = document.positionAt(
    repeatForRegion.data.iterableStartOffset
  );
  const endPosition = document.positionAt(
    repeatForRegion.data.iterableEndOffset - 1
  );
  const range = Range.create(startPosition, endPosition);

  return range;
}
