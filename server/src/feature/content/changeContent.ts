import { Container } from 'aurelia-dependency-injection';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Logger } from '../../common/logging/logger';
import { AureliaProjects } from '../../core/AureliaProjects';

const logger = new Logger('changeContent');

export async function onConnectionDidChangeContent(
  container: Container,
  { document }: TextDocumentChangeEvent<TextDocument>
) {
  switch (document.languageId) {
    case 'javascript':
    case 'typescript': {
      const aureliaProjects = container.get(AureliaProjects);
      if (aureliaProjects.preventHydration(document)) return;

      // await aureliaProjects.hydrate([document]);
      await aureliaProjects.updateManyViewModel([document]);
      logger.log('Update View models');
    }
    case 'html': {
      logger.log('Update View');
    }
  }
}
