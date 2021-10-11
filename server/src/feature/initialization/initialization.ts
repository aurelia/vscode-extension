import { Container } from 'aurelia-dependency-injection';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProjects } from '../../core/aurelia-projects';
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
  await aureliaProjects.setAndVerifyProjectFiles(extensionSettings);
  await aureliaProjects.hydrateProjectWithActiveDocuments(activeDocuments);
}
