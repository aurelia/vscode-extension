import { inject } from 'aurelia-dependency-injection';
import { LintVisitor } from './LintVisitor';

@inject(LintVisitor)
export class RegionParser {
  constructor(public lintVisitor: LintVisitor) {}
}
