import { Container } from 'aurelia-dependency-injection';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Logger } from '../../common/logging/logger';

import { AureliaProjects } from '../../core/AureliaProjects';

const logger = new Logger('saveContent');

export async function onDidSave(
  container: Container,
  { document }: TextDocumentChangeEvent<TextDocument>
) {
  switch (document.languageId) {
    case 'typescript': {
      const aureliaProjects = container.get(AureliaProjects);
      if (aureliaProjects.preventHydration(document)) return;

      logger.log('Updating View model.')
      aureliaProjects.updateManyViewModel([document]);
    }
  }
}
