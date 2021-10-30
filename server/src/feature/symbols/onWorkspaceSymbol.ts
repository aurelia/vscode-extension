import { Container } from 'aurelia-dependency-injection';
import { Range } from 'vscode-languageserver-protocol';
import { Position, SymbolInformation } from 'vscode-languageserver-types';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { ViewRegionInfo } from '../../core/embeddedLanguages/embeddedSupport';
import { convertToSymbolName } from './onDocumentSymbol';

export function onWorkspaceSymbol(container: Container, query: string) {
  const finalWorkspaceSymbols: SymbolInformation[] = [];
  const aureliaProjects = container.get(AureliaProjects);
  aureliaProjects.getAll().forEach((aureliaProject) => {
    aureliaProject.aureliaProgram?.aureliaComponents
      .getAll()
      .forEach((component) => {
        component.viewRegions?.forEach((region) => {
          if (!component.viewFilePath) return;

          const viewUri = UriUtils.toUri(component.viewFilePath);
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
  region: ViewRegionInfo<any>
): SymbolInformation | undefined {
  const converted = convertToSymbolName(region);
  if (!converted) return;

  const symbolName = `Au: ${converted.value}`;
  const start: Position = {
    line: region.startLine! - 1,
    character: region.startCol! - 1,
  };
  const end: Position = {
    line: region.endLine! - 1,
    character: region.endCol! - 1,
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
