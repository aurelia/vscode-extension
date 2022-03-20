import { Container } from 'aurelia-dependency-injection';

import { LintVisitor } from '../aot/parser/linting/LintVisitor';
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
  const aureliaProjects = container.get(AureliaProjects);

  container.registerInstance(
    AnalyzerService,
    new AnalyzerService(aureliaProjects)
  );
  const analyzerService = container.get(AnalyzerService);

  container.registerInstance(
    RegionService,
    new RegionService(aureliaProjects, analyzerService)
  );

  container.registerInstance(
    LintVisitor,
    new LintVisitor(analyzerService, aureliaProjects)
  );

  const lintVisitor = container.get(LintVisitor);
  const regionService = container.get(RegionService);

  container.registerInstance(
    AureliaDiagnostics,
    new AureliaDiagnostics(regionService, lintVisitor)
  );
}
