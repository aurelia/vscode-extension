import { Container } from 'aurelia-dependency-injection';
import { AureliaProjects } from '../common/aurelia-projects';
import {
  ExtensionSettings,
  DocumentSettings,
} from '../configuration/DocumentSettings';

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
