import { inject } from 'aurelia-dependency-injection';
import { AureliaProjects } from './AureliaProjects';
import { AnalyzerService } from './AnalyzerService';

@inject(AureliaProjects, AnalyzerService)
// @inject(class ASHT{}, AnalyzerService)
export class RegionService {
  constructor(
    public aureliaProject: AureliaProjects,
    public analyzerService: AnalyzerService
  ) {}
}
