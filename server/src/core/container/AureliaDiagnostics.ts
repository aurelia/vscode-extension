import { inject } from 'aurelia-dependency-injection';
import { AureliaProjects } from './AureliaProjects';
import { AnalyzerService } from './AnalyzerService';
import { RegionParser } from './RegionParser';
import { RegionService } from './RegionService';

@inject(AureliaProjects, AnalyzerService, RegionParser, RegionService)
export class AureliaDiagnostics {
  constructor(
    private readonly aureliaProjects: AureliaProjects,
    private readonly analyzerService: AnalyzerService,
    private readonly regionParser: RegionParser,
    private readonly regionService: RegionService
  ) {}
}
