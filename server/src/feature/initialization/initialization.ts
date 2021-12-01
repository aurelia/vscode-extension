import { Container } from 'aurelia-dependency-injection';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Logger } from '../../common/logging/logger';

import { AureliaProjects } from '../../core/AureliaProjects';
import { ExtensionSettings } from '../configuration/DocumentSettings';

const logger = new Logger('initialization');

/**
 * 1. Init DI
 * 2. Detect Aurelia project
 * 3. Hydrate Project map
 */
export async function onConnectionInitialized(
  container: Container,
  extensionSettings: ExtensionSettings,
  activeDocuments: TextDocument[] = []
) {
  const aureliaProjects = container.get(AureliaProjects);
  const verified = await aureliaProjects.initAndVerify(extensionSettings);
  if (!verified) return;
  const hydrated = await aureliaProjects.hydrate(activeDocuments);

  if (hydrated) {
    /* prettier-ignore */ logger.log('Initilization done. Aurelia Extension is ready to use. 🚀',{logMs:true,msEnd:true});
  }
}
