import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'culog';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProjects } from '../../core/AureliaProjects';

const logger = new Logger({ scope: 'save-content' });

export async function onDidSave(
  container: Container,
  { document }: TextDocumentChangeEvent<TextDocument>
) {
  switch (document.languageId) {
    case 'typescript': {
      const aureliaProjects = container.get(AureliaProjects);
      if (aureliaProjects.preventHydration(document)) return;

      await aureliaProjects.updateManyViewModel([document]);
    }
  }
}
