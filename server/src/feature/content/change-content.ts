import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'culog';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProjects } from '../../core/aurelia-projects';
import { uriToPath } from '../../common/uriToPath';

const logger = new Logger({ scope: 'change-content' });

export async function onConnectionDidChangeContent(
  container: Container,
  change: TextDocumentChangeEvent<TextDocument>
) {
  switch (change.document.languageId) {
    case 'typescript': {
      const aureliaProjects = container.get(AureliaProjects);
      if (preventHydration(aureliaProjects, change)) return;

      const documentPaths = uriToPath([change.document]);
      await aureliaProjects.hydrateAureliaProjects(documentPaths);
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
  aureliaProjectFiles: AureliaProjects,
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
