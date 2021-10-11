import { Container } from 'aurelia-dependency-injection';
import {
  Position,
  Range,
  TextDocumentEdit,
  TextEdit,
  WorkspaceEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjects } from '../../core/aurelia-projects';
import {
  getWordAtOffset,
  getWordInfoAtOffset,
} from '../../common/documens/find-source-word';
import { UriUtils } from '../../common/view/uri-utils';
import { LanguageModes } from '../../core/embeddedLanguages/languageModes';

export async function onRenameRequest(
  position: Position,
  document: TextDocument,
  newName: string,
  languageModes: LanguageModes,
  container: Container
): Promise<WorkspaceEdit | undefined> {
  if (document.uri.includes('.ts')) {
    return;
  }

  const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
    document,
    position
  );

  if (!modeAndRegion) return;
  const { mode, region } = modeAndRegion;

  if (!mode) return normalRename(position, document, newName);
  if (!region) return normalRename(position, document, newName);
  // region; /*?*/

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

function typescriptRename(
  container: Container,
  position: Position,
  document: TextDocument
): WorkspaceEdit | PromiseLike<WorkspaceEdit | undefined> | undefined {
  const aureliaProjects = container.get(AureliaProjects);
  const tsMorphProject = aureliaProjects.getFirst().aureliaProgram
    ?.tsMorphProject;

  if (!tsMorphProject) return;
  tsMorphProject;

  const offset = document.offsetAt(position);
  const sourceWord = getWordAtOffset(document.getText(), offset);
  const sourceFile = tsMorphProject.getSourceFile(
    UriUtils.toPath(document.uri)
  );
  const text = sourceFile?.getText();
  sourceFile?.getVariableDeclaration(sourceWord)?.rename('hihih');
}
