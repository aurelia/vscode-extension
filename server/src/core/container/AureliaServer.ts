import { Container } from 'aurelia-dependency-injection';
import { ExtensionSettings } from './DocumentSettings';
import { initDeps } from './initDeps';

export class AureliaServer {
  constructor(container: Container, settings: ExtensionSettings) {
    initDeps(container, settings);
  }
}
