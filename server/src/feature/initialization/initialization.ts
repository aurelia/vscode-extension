import { Container } from 'aurelia-dependency-injection';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProjects } from '../../core/AureliaProjects';
import { ExtensionSettings } from '../configuration/DocumentSettings';

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
  await aureliaProjects.hydrate(activeDocuments);
}
