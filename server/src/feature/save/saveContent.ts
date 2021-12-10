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
  const aureliaProjects = container.get(AureliaProjects);
  if (aureliaProjects.preventHydration(document)) return;

  switch (document.languageId) {
    case 'javascript':
    case 'typescript': {
      aureliaProjects.updateManyViewModel([document]);
      logger.log('View model updated.');
      break;
    }
    case 'html': {
      aureliaProjects.updateManyView([document]);
      logger.log('View updated');
    }
  }
}
