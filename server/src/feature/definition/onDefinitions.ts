import { pathToFileURL } from 'url';

import { Position, TextDocument } from 'vscode-html-languageservice';
import { LocationLink, Range } from 'vscode-languageserver';

import { RegionParser } from '../../aot/parser/regions/RegionParser';
import { AbstractRegion } from '../../aot/parser/regions/ViewRegions';
import { isViewModelDocument } from '../../common/documens/TextDocumentUtils';
import { RegionService } from '../../common/services/RegionService';
import { ParseHtml } from '../../common/view/document-parsing';
import { DocumentSettings } from '../../configuration/DocumentSettings';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { aureliaDefinitionFromViewModel } from './aureliaDefintion';

export async function onDefintion(
  document: TextDocument,
  position: Position,
  container: Container
): Promise<LocationLink[] | undefined> {
  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(document.uri);
  if (!targetProject) return;
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return;

  const targetComponent =
    aureliaProgram.aureliaComponents.getOneByFromDocument(document);

  const documentSettings = container.get(DocumentSettings);
  const isViewModel = isViewModelDocument(document, documentSettings);

  if (isViewModel) {
    const defintion = await aureliaDefinitionFromViewModel(
      container,
      document,
      position
    );
    return defintion;
  }

  let regions: AbstractRegion[] = [];
  if (targetComponent) {
    regions = targetComponent?.viewRegions;
  } else {
    // Quickfix for Html-only Custom Elements
    if (!ParseHtml.isHtmlWithRootTemplate(document.getText())) return;
    regions = RegionParser.parse(
      document,
      aureliaProgram.aureliaComponents.getAll()
    );
  }

  if (regions.length === 0) return;

  const offset = document.offsetAt(position);
  const region = RegionService.findRegionAtOffset(regions, offset);
  if (region === undefined) return;
  const doDefinition = region.languageService.doDefinition;

  if (doDefinition) {
    const definition = await doDefinition(
      aureliaProgram,
      document,
      position,
      region
    );

    if (!definition) return;

    const { line, character } = definition.lineAndCharacter;
    const targetPath =
      definition.viewFilePath ?? definition.viewModelFilePath ?? '';

    const range = Range.create(
      Position.create(line - 1, character),
      Position.create(line, character)
    );

    return [
      LocationLink.create(pathToFileURL(targetPath).toString(), range, range),
    ];
  }
}
