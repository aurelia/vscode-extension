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

export async function onConnectionInitialized(
  container: Container,
  workspaceRootUri: string,
  extensionSettings: ExtensionSettings,
  activeDocuments: TextDocument[] = [],
  ) {
  initDependencyInjection(container, extensionSettings);

  const aureliaExtension = container.get(AureliaExtension);

  const cwd = fileURLToPath(normalize(workspaceRootUri));
  const packageJsonPaths = await fastGlob('**/package.json', {
    absolute: true,
    ignore: ['node_modules'],
    cwd,
  });

  await aureliaExtension.setAureliaProjectMap(packageJsonPaths, activeDocuments);

  const aureliaProjectMap = aureliaExtension.getAureliaProjectMap();
  const hasAureliaProject = aureliaProjectMap.size > 0;

  if (!hasAureliaProject) {
    console.log('[INFO][server.ts] No active Aurelia project found.');
    console.log(
      '[INFO][server.ts] Extension will activate, as soon as a file inside an Aurelia project is opened.'
    );
    return;
  }

  console.log(
    `[INFO][server.ts] Found ${aureliaProjectMap.size} active Aurelia projects in: `
  );
  aureliaProjectMap.forEach((value, path) => {
    console.log(path)
  })

  console.log('[INFO][server.ts] Parsing Aurelia related data...');
  await aureliaExtension.hydrateAureliaProjectMap();
  const auProjectMap = aureliaExtension.getAureliaProjectMap();
}
