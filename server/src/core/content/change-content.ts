import { Container } from 'aurelia-dependency-injection';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjectFiles } from '../../common/AureliaProjectFiles';
import { uriToPath } from '../../common/uriToPath';

export async function onConnectionDidChangeContent(
  container: Container,
  change: TextDocumentChangeEvent<TextDocument>
) {
  switch (change.document.languageId) {
    case 'typescript': {
      const aureliaProjectFiles = container.get(AureliaProjectFiles);
      const documentPaths = uriToPath([change.document]);
      aureliaProjectFiles.hydrateAureliaProjectList(documentPaths);

      // updateAureliaComponents(aureliaProgram);
    }
  }

  console.log('TCL: change', change);
  // console.log('[server.ts] (re-)get Language Modes');
  // languageModes = await getLanguageModes();
}
