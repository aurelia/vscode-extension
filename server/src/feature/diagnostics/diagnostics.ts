import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionParser } from '../../aot/parser/regions/RegionParser';
import {
  CustomElementRegion,
  ViewRegionSubType,
  ViewRegionType,
} from '../../aot/parser/regions/ViewRegions';
import { AnalyzerService } from '../../common/services/AnalyzerService';
import { RegionService } from '../../common/services/RegionService';
import { Container } from '../../core/container';

export function createDiagnostics(
  container: Container,
  document: TextDocument
): Diagnostic[] {
  const lintResults: Diagnostic[] = [];
  const startTagRegions = RegionService.getRegionsOfTypeInDocument(
    container,
    document,
    {
      regionType: ViewRegionType.CustomElement,
      subRegionType: ViewRegionSubType.StartTag,
    }
  );

  startTagRegions.forEach((region) => {
    region.tagName; /* ? */
    const bindables = CustomElementRegion.getBindableAttributes(region);
    // bindables; /* ? */

    const component = AnalyzerService.getOneComponentBy(
      container,
      document,
      'componentName',
      region.tagName
    );
    if (!component) return [];

    component.className; /* ? */
    const lintResult = RegionParser.lint(startTagRegions, [component]);
    lintResults.push(...lintResult);
  });

  // startTagRegions;

  return lintResults;
}
