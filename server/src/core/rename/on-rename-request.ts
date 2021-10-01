import { Position, Range, WorkspaceEdit } from 'vscode-languageserver';
import {
  LanguageModes,
  TextDocument,
} from '../../feature/embeddedLanguages/languageModes';

export async function onRenameRequest(
  position: Position,
  document: TextDocument,
  newName: string,
  languageModes: LanguageModes
): Promise<WorkspaceEdit | undefined> {
  const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
    document,
    position
  );

  if (!modeAndRegion) return;
  const { mode, region } = modeAndRegion;

  if (!mode) return;
  if (!region) return;

  const doRename = mode.doRename;

  if (doRename) {
    const renamed = await doRename(document, position, newName, region);
    return renamed;
  }
}
