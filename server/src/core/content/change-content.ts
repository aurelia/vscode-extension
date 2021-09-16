import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'culog';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjectFiles } from '../../common/AureliaProjectFiles';
import { uriToPath } from '../../common/uriToPath';

const logger = new Logger({ scope: 'change-content' });

export async function onConnectionDidChangeContent(
  container: Container,
  change: TextDocumentChangeEvent<TextDocument>
) {
  switch (change.document.languageId) {
    case 'typescript': {
      const aureliaProjectFiles = container.get(AureliaProjectFiles);
      if (preventHydration(aureliaProjectFiles, change)) return;

      const documentPaths = uriToPath([change.document]);
      aureliaProjectFiles.hydrateAureliaProjectList(documentPaths);
    }
  }
}

/**
 * Document changes -> version > 1.
 */
function hasDocumentChanged({ version }: TextDocument): boolean {
  return version > 1;
}

/**
 * Prevent when
 * 1. Project already includes document
 * 2. Document was just opened
 */
function preventHydration(
  aureliaProjectFiles: AureliaProjectFiles,
  change: TextDocumentChangeEvent<TextDocument>
): boolean {
  // 1.
  if (!aureliaProjectFiles.isDocumentIncluded(change.document)) {
    return false;
  }

  // 2.
  if (hasDocumentChanged(change.document)) {
    return false;
  }

  logger.todo(
    `What should happen to document, that is not included?: ${change.document.uri}`
  );

  return true;
}
