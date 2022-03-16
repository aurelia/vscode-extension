import { inject } from 'aurelia-dependency-injection';
import { AureliaProjects } from './AureliaProjects';
import * as asht from './RegionService'

@inject(AureliaProjects)
export class AnalyzerService {
  constructor(public aureliaProjects: AureliaProjects) {}
}
