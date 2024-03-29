import { Container } from 'aurelia-dependency-injection';
import {
  Position,
  Range,
  TextEdit,
  WorkspaceEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { CustomElementRegion } from '../../aot/parser/regions/ViewRegions';
import { getWordInfoAtOffset } from '../../common/documens/find-source-word';
import { isViewModelDocument } from '../../common/documens/TextDocumentUtils';
import { RegionService } from '../../common/services/RegionService';
import { DocumentSettings } from '../../configuration/DocumentSettings';
import { AureliaProjects } from '../../core/AureliaProjects';
import { aureliaRenameFromViewModel } from './aureliaRename';

export async function onRenameRequest(
  document: TextDocument,
  position: Position,
  newName: string,
  container: Container
): Promise<WorkspaceEdit | undefined> {
  const documentSettings = container.get(DocumentSettings);
  const isViewModel = isViewModelDocument(document, documentSettings);

  if (isViewModel) {
    const renamed = aureliaRenameFromViewModel(
      container,
      documentSettings,
      document,
      position,
      newName
    );
    return renamed;
  }

  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(document.uri);
  if (!targetProject) return;
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return;

  const targetComponent =
    aureliaProgram.aureliaComponents.getOneByFromDocument(document);
  const regions = targetComponent?.viewRegions;

  if (!regions) return;

  const offset = document.offsetAt(position);
  const region = RegionService.findRegionAtOffset(regions, offset);
  if (CustomElementRegion.is(region)) {
    const isInCustomElementStartTag = RegionService.isInCustomElementStartTag(
      region,
      offset
    );
    if (isInCustomElementStartTag === false) {
      return normalRename(position, document, newName);
    }
  }
  if (region == null) {
    return;
  }

  // @ts-ignore TODO: implement rename for CustomElement
  const doRename = region.languageService.doRename;

  if (doRename) {
    const renamed = await doRename(
      container,
      aureliaProgram,
      document,
      position,
      newName,
      region
    );
    // renamed; /* ? */
    return renamed;
  }
}

function normalRename(
  position: Position,
  document: TextDocument,
  newName: string
) {
  const offset = document.offsetAt(position);
  const { startOffset, endOffset } = getWordInfoAtOffset(
    document.getText(),
    offset
  );
  const startPosition = document.positionAt(startOffset);
  const endPosition = document.positionAt(endOffset + 1); // TODO: remove +1 (has to do with index 0 vs 1)
  const range = Range.create(startPosition, endPosition);

  return {
    changes: {
      [document.uri]: [TextEdit.replace(range, newName)],
    },
    // documentChanges: [
    //   TextDocumentEdit.create(
    //     { version: document.version + 1, uri: document.uri },
    //     [TextEdit.replace(range, newName)]
    //   ),
    // ],
  };
}
