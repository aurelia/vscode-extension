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
      if (aureliaProjectFiles.isDocumentIncluded(change.document)) {
        return;
      } else {
        logger.todo(
          `What should happen to document, that is not included?: ${change.document.uri}`
        );
      }

      const documentPaths = uriToPath([change.document]);
      aureliaProjectFiles.hydrateAureliaProjectList(documentPaths);

      // updateAureliaComponents(aureliaProgram);
    }
  }

  console.log('TCL: change', change);
  // console.log('[server.ts] (re-)get Language Modes');
  // languageModes = await getLanguageModes();
}
