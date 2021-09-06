import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'culog';
import * as path from 'path'
import * as fastGlob from 'fast-glob';
import { fileURLToPath } from 'url';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjectFiles, AureliaProject } from '../../common/AureliaProjectFiles';
import { ExtensionSettings } from '../../configuration/DocumentSettings';
import { initDependencyInjection } from '../depdenceny-injection';

const logger = new Logger({ scope: 'aureliaServer' });


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
  /*  */
  initDependencyInjection(container, extensionSettings);

  /*  */
  const packageJsonPaths = getPackageJsonPaths(extensionSettings);
  const aureliaProjectFiles = container.get(AureliaProjectFiles);
  await aureliaProjectFiles.setAureliaProjects(packageJsonPaths);
  const aureliaProjects = aureliaProjectFiles.getAureliaProjects();
  const hasAureliaProject = aureliaProjects.length > 0;

  if (!hasAureliaProject) {
    logHasNoAureliaProject();
    return;
  }
  logFoundAureliaProjects(aureliaProjects);

  /*  */
  logger.debug(['Parsing Aurelia related data...'], { logLevel: 'INFO' });
  const activeDocumentPaths = activeDocuments.map((activeDocument) => {
    const documentPath = fileURLToPath(path.normalize(activeDocument.uri));
    return documentPath;
  });
  await aureliaProjectFiles.hydrateAureliaProjectList(activeDocumentPaths);
}

function logFoundAureliaProjects(aureliaProjects: AureliaProject[]) {
  logger.debug([`Found ${aureliaProjects.length} Aurelia projects in: `], {
    logLevel: 'INFO',
  });
  aureliaProjects.forEach(({ tsConfigPath }) => {
    logger.debug([tsConfigPath], {
      logLevel: 'INFO',
    });
  });
}

function logHasNoAureliaProject() {
  logger.debug(['No active Aurelia project found.'], { logLevel: 'INFO' });
  logger.debug(
    [
      'Extension will activate, as soon as a file inside an Aurelia project is opened.',
    ],
    { logLevel: 'INFO' }
  );
}

function getPackageJsonPaths(extensionSettings: ExtensionSettings) {
  const workspaceRootUri =
    extensionSettings.aureliaProject?.rootDirectory ?? '';
  const cwd = fileURLToPath(path.normalize(workspaceRootUri));
  const packageJsonPaths = fastGlob.sync('**/package.json', {
    absolute: true,
    ignore: ['node_modules'],
    cwd,
  });
  return packageJsonPaths;
}