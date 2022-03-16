import { Container } from 'aurelia-dependency-injection';

import { RegionParser } from '../aot/parser/regions/RegionParser';
import { AnalyzerService } from '../common/services/AnalyzerService';
import { RegionService } from '../common/services/RegionService';
import {
  ExtensionSettings,
  DocumentSettings,
} from '../configuration/DocumentSettings';
import { AureliaDiagnostics } from '../feature/diagnostics/diagnostics';
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

  // const aureliaProjects = container.get(AureliaProjects);
  // container.autoRegister(AnalyzerService, AnalyzerService);
  // container.autoRegister(RegionParser, RegionParser);
  // container.autoRegister(RegionService, RegionService);

  // const analyzerService = container.get(AnalyzerService);
  // const regionParser = container.get(RegionParser);
  // const regionService = container.get(RegionService);

  // container.registerInstance(
  //   AureliaDiagnostics,
  //   new AureliaDiagnostics(
  //     aureliaProjects,
  //     analyzerService,
  //     regionParser,
  //     regionService
  //   )
  // );
}
