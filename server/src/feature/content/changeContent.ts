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
  const aureliaProjects = container.get(AureliaProjects);

  // Keep track of changed map
  aureliaProjects.addDocumentToEditingTracker(document);

  // Hydration
  if (!aureliaProjects.isHydrated()) {
    /* prettier-ignore */ logger.log('Initilization started.',{logMs:true,msStart:true});
    await aureliaProjects.hydrate([document]);
    /* prettier-ignore */ logger.log('Initilization done. Aurelia Extension is ready to use. 🚀',{logMs:true,msEnd:true});
    return;
  }
  if (aureliaProjects.preventHydration(document)) return;

  // Updating
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
    }  }
}
