import { Container } from 'aurelia-dependency-injection';
import {
  Position,
  Range,
  TextEdit,
  WorkspaceEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { getWordInfoAtOffset } from '../../common/documens/find-source-word';
import { LanguageModes } from '../../core/embeddedLanguages/languageModes';
import { DocumentSettings } from '../configuration/DocumentSettings';
import { aureliaRenameFromViewModel } from './aureliaRename';

function isViewModelDocument(
  document: TextDocument,
  documentSettings: DocumentSettings
) {
  const settings = documentSettings.getSettings();
  const scriptExtensions = settings?.relatedFiles?.script;
  const isScript = scriptExtensions?.find((extension) =>
    document.uri.endsWith(extension)
  );
  return isScript;
}

export async function onRenameRequest(
  position: Position,
  document: TextDocument,
  newName: string,
  languageModes: LanguageModes,
  container: Container
): Promise<WorkspaceEdit | undefined> {
  // if (document.uri.includes('.ts')) {
  //   return;
  // }
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

  const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
    document,
    position
  );

  if (!modeAndRegion) return;
  const { mode, region } = modeAndRegion;

  if (!mode) return normalRename(position, document, newName);
  if (!region) return normalRename(position, document, newName);

  const doRename = mode.doRename;

  if (doRename) {
    const renamed = await doRename(document, position, newName, region);
    // renamed; /*?*/
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
