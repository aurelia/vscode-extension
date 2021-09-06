import { Container } from 'aurelia-dependency-injection';
import { AureliaProjectFiles } from '../common/AureliaProjectFiles';
import {
  ExtensionSettings,
  DocumentSettings,
} from '../configuration/DocumentSettings';
import { AureliaServer } from './aureliaServer';

export function initDependencyInjection(
  container: Container,
  extensionSettings: ExtensionSettings
) {
  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(
    AureliaProjectFiles,
    new AureliaProjectFiles(settings)
  );
  container.registerInstance(AureliaServer, new AureliaServer(container));
}
