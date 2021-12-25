import { Container } from 'aurelia-dependency-injection';
import { Range } from 'vscode-languageserver-protocol';
import { Position, SymbolInformation } from 'vscode-languageserver-types';

import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { AbstractRegion } from '../../core/regions/ViewRegions';
import { convertToSymbolName } from './onDocumentSymbol';

// export function onWorkspaceSymbol(container: Container, query: string) {
export function onWorkspaceSymbol(container: Container) {
  const finalWorkspaceSymbols: SymbolInformation[] = [];
  const aureliaProjects = container.get(AureliaProjects);
  aureliaProjects.getAll().forEach((aureliaProject) => {
    aureliaProject.aureliaProgram?.aureliaComponents
      .getAll()
      .forEach((component) => {
        component.viewRegions?.forEach((region) => {
          if (component.viewFilePath === undefined) return;

          const viewUri = UriUtils.toVscodeUri(component.viewFilePath);
          const symbol = createWorkspaceSymbol(viewUri, region);
          if (!symbol) return;

          finalWorkspaceSymbols.push(symbol);
        });
      });
  });

  return finalWorkspaceSymbols;
}

function createWorkspaceSymbol(
  uri: string,
  region: AbstractRegion
): SymbolInformation | undefined {
  const converted = convertToSymbolName(region);
  if (!converted) return;

  const symbolName = `Au: ${converted.value}`;
  const start: Position = {
    line: region.sourceCodeLocation.startLine,
    character: region.sourceCodeLocation.startCol,
  };
  const end: Position = {
    line: region.sourceCodeLocation.endLine,
    character: region.sourceCodeLocation.endCol,
  };
  const range = Range.create(start, end);
  const symbolInformation = SymbolInformation.create(
    symbolName,
    converted.icon,
    range,
    uri
  );

  return symbolInformation;
}
