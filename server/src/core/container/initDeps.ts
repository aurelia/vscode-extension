import { Container } from 'aurelia-dependency-injection';
import { AnalyzerService } from './AnalyzerService';
import { AureliaDiagnostics } from './AureliaDiagnostics';
import { AureliaProjects } from './AureliaProjects';
import { ExtensionSettings, DocumentSettings } from './DocumentSettings';
import { RegionParser } from './RegionParser';
import { RegionService } from './RegionService';

export function initDeps(container: Container, settings: ExtensionSettings) {
  container.registerInstance(DocumentSettings, new DocumentSettings(settings));
  const docsSettings = container.get(DocumentSettings);

  container.registerInstance(
    AureliaProjects,
    new AureliaProjects(docsSettings)
  );

  container.registerSingleton(AnalyzerService, AnalyzerService);
  container.registerSingleton(RegionParser, RegionParser);
  container.registerSingleton(RegionService, RegionService);
  container.registerSingleton(AureliaDiagnostics, AureliaDiagnostics);

  const analyzerService = container.get(AnalyzerService);
  analyzerService.aureliaProjects.docSettings.settings
  /* prettier-ignore */ console.log('TCL ~ file: initDeps.ts ~ line 25 ~ initDeps ~ analyzerService.aureliaProjects.docSettings.settings', analyzerService.aureliaProjects.docSettings.settings)

  // const regionService = container.get(RegionService);
  // regionService.aureliaProject.docSettings.settings; /*?*/

  // const regionParser = container.get(RegionParser);
  // regionParser.lintVisitor.lintVar;

  // const lintVisitor = container.get(LintVisitor);
  // lintVisitor.lintVar; /*?*/
  // lintVisitor.test(); /*?*/
}
