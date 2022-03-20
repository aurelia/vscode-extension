import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LintVisitor } from '../../aot/parser/linting/LintVisitor';

import { RegionService } from '../../common/services/RegionService';
import { inject } from '../../core/container';

@inject(RegionService, LintVisitor)
export class AureliaDiagnostics {
  constructor(
    private readonly regionService: RegionService,
    private readonly lintVisitor: LintVisitor
  ) {}

  public createDiagnostics(document: TextDocument): Diagnostic[] {
    const lintResults: Diagnostic[] = [];
    const regions = this.regionService.getRegionsInDocument(document);

    regions.forEach((region) => {
      const lintResult = region.acceptArray<Diagnostic>(this.lintVisitor);
      lintResults.push(...lintResult);
    });

    return lintResults;
  }
}
