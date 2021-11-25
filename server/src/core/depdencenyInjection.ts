import { Container } from 'aurelia-dependency-injection';

import {
  ExtensionSettings,
  DocumentSettings,
} from '../feature/configuration/DocumentSettings';
import { AureliaProjects } from './AureliaProjects';

export function initDependencyInjection(
  container: Container,
  extensionSettings: ExtensionSettings
) {
  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(AureliaProjects, new AureliaProjects(settings));
}
