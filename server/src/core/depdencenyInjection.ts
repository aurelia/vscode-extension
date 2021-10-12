import { Container } from 'aurelia-dependency-injection';

import {
  ExtensionSettings,
  DocumentSettings,
} from '../feature/configuration/DocumentSettings';
import { AureliaProjects } from './AureliaProjects';
import { AureliaTsMorph } from './tsMorph/AureliaTsMorph';

export function initDependencyInjection(
  container: Container,
  extensionSettings: ExtensionSettings
) {
  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(AureliaTsMorph, new AureliaTsMorph(settings));
  const aureliaTsMorph = container.get(AureliaTsMorph);
  container.registerInstance(
    AureliaProjects,
    new AureliaProjects(aureliaTsMorph, settings)
  );
}
