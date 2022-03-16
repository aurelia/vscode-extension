import 'reflect-metadata';

import { Container, autoinject, inject } from 'aurelia-dependency-injection';

class Settings {
  flag: string;
}

export class AureliaServer {
  constructor(container: Container, settings: Settings) {
    init(container, settings);
  }
}

// @inject(Settings)
export class DocumentSettings {
  constructor(public settings: Settings) {}
  public AAAABBBCC: string;
}

export class AureliaProjects {
  // constructor(public settings: Settings = { flag: 'in-class' }) {}
  constructor(public docSettings: DocumentSettings) {}
}

export class LintVisitor {
  public lintVar = '>>> OAY BRO';
  test() {
    return 'okaypf ';
  }
}

@inject(AureliaProjects)
export class AnalyzerService {
  constructor(public aureliaProjects: AureliaProjects) {}
}

@inject(LintVisitor)
export class RegionParser {
  constructor(public lintVisitor: LintVisitor) {}
}

@inject(AureliaProjects, AnalyzerService)
// @inject(class ASHT{}, AnalyzerService)
export class RegionService {
  constructor(
    public aureliaProject: AureliaProjects,
    public analyzerService: AnalyzerService
  ) {}
}

@inject(AureliaProjects, AnalyzerService, RegionParser, RegionService)
export class AureliaDiagnostics {
  constructor(
    private readonly aureliaProjects: AureliaProjects,
    private readonly analyzerService: AnalyzerService,
    private readonly regionParser: RegionParser,
    private readonly regionService: RegionService
  ) {}
}

function init(container: Container, settings: Settings) {
  container.registerInstance(DocumentSettings, new DocumentSettings(settings));
  const docsSettings = container.get(DocumentSettings);

  container.registerInstance(
    AureliaProjects,
    new AureliaProjects(docsSettings)
  );

  const regionService = container.get(RegionService);
  regionService.aureliaProject.docSettings.settings; /*?*/

  const regionParser = container.get(RegionParser);
  regionParser.lintVisitor.lintVar;

  const lintVisitor = container.get(LintVisitor);
  lintVisitor.lintVar; /*?*/
  lintVisitor.test(); /*?*/
}

function server() {
  const container = new Container();
  const serverSetting: Settings = { flag: 'WOORK PLEASE' };

  const aureliaServer = new AureliaServer(container, serverSetting);
  container.getResolver(AureliaProjects); /*?*/
}
server();
// const analyzerService = container.get(AnalyzerService);
// const regionParser = container.get(RegionParser);
// const regionService = container.get(RegionService);
