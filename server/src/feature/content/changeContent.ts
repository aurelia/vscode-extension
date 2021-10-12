import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'culog';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProjects } from '../../core/AureliaProjects';
import { uriToPath } from '../../common/uriToPath';

const logger = new Logger({ scope: 'change-content' });

export async function onConnectionDidChangeContent(
  container: Container,
  change: TextDocumentChangeEvent<TextDocument>
) {
  switch (change.document.languageId) {
    case 'typescript': {
      const aureliaProjects = container.get(AureliaProjects);
      if (aureliaProjects.preventHydration(change)) return;

      const documentPaths = uriToPath([change.document]);
      await aureliaProjects.hydrate(documentPaths);
    }
  }
}
