import { Container } from 'aurelia-dependency-injection';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Logger } from '../../common/logging/logger';
import { ExtensionSettings } from '../../configuration/DocumentSettings';
import { AureliaProjects } from '../../core/AureliaProjects';

const logger = new Logger('initialization');

/**
 * 1. Init DI
 * 2. Detect Aurelia project
 * 3. Hydrate Project map
 */
export async function onConnectionInitialized(
  container: Container,
  extensionSettings: ExtensionSettings,
  activeDocuments: TextDocument[] = [],
  forceReinit: boolean = false
) {
  /* prettier-ignore */ logger.log('Initilization started.',{logMs:true,msStart:true});

  const aureliaProjects = container.get(AureliaProjects);
  const isAureliaProject = await aureliaProjects.getAureliaProjectsOnly(extensionSettings);
  if (!isAureliaProject) return;

  const hydrated = await aureliaProjects.hydrate(activeDocuments, forceReinit);
  if (hydrated) {
    /* prettier-ignore */ logger.log('Initilization done. Aurelia Extension is ready to use. 🚀',{logMs:true,msEnd:true});
  }
}
