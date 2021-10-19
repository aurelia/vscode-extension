import { Container } from 'aurelia-dependency-injection';

import {
  ExtensionSettings,
  DocumentSettings,
} from '../feature/configuration/DocumentSettings';
import { AureliaProjects } from './AureliaProjects';
import { TsMorphProject } from './tsMorph/AureliaTsMorph';

export function initDependencyInjection(
  container: Container,
  extensionSettings: ExtensionSettings
) {
  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(TsMorphProject, new TsMorphProject(settings));
  container.registerInstance(AureliaProjects, new AureliaProjects(settings));
}
