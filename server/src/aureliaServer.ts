import { Container } from 'aurelia-dependency-injection';
import * as fastGlob from 'fast-glob';
import { fileURLToPath } from 'url';
import { normalize } from 'path';
import { AureliaExtension } from './common/AureliaExtension';
import {
  ExtensionSettings,
  DocumentSettings,
} from './configuration/DocumentSettings';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function initDependencyInjection(
  container: Container,
  extensionSettings: ExtensionSettings
) {
  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(AureliaExtension, new AureliaExtension(settings));
}

/**
 * 1. Init DI
 * 2. Detect Aurelia project
 * 3. Hydrate Project map
 */
export async function onConnectionInitialized(
  container: Container,
  workspaceRootUri: string,
  extensionSettings: ExtensionSettings,
  activeDocuments: TextDocument[] = []
) {
  /*  */
  initDependencyInjection(container, extensionSettings);

  const aureliaExtension = container.get(AureliaExtension);

  /*  */
  const cwd = fileURLToPath(normalize(workspaceRootUri));
  const packageJsonPaths = await fastGlob('**/package.json', {
    absolute: true,
    ignore: ['node_modules'],
    cwd,
  });

  await aureliaExtension.setAureliaProjectList(
    packageJsonPaths,
    activeDocuments
  );

  const aureliaProjectList = aureliaExtension.getAureliaProjectList();
  const hasAureliaProject = aureliaProjectList.length > 0;

  if (!hasAureliaProject) {
    console.log('[INFO][server.ts] No active Aurelia project found.');
    console.log(
      '[INFO][server.ts] Extension will activate, as soon as a file inside an Aurelia project is opened.'
    );
    return;
  }

  console.log(
    `[INFO][server.ts] Found ${aureliaProjectList.length} active Aurelia projects in: `
  );
  aureliaProjectList.forEach(({ tsConfigPath }) => {
    console.log(tsConfigPath);
  });

  /*  */
  console.log('[INFO][server.ts] Parsing Aurelia related data...');
  await aureliaExtension.hydrateAureliaProjectList();
  const auProjectList = aureliaExtension.getAureliaProjectList();
}
