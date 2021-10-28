import { pathToFileURL } from 'url';
import { LocationLink, Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getWordAtOffset } from '../../common/documens/find-source-word';
import { getRelatedFilePath } from '../../common/documens/related';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { findRegionsByWord } from '../../core/regions/findSpecificRegion';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';
import { DocumentSettings } from '../configuration/DocumentSettings';

export async function aureliaDefinitionFromViewModel(
  container: Container,
  document: TextDocument,
  position: Position
): Promise<LocationLink[] | undefined> {
  const offset = document.offsetAt(position);
  const sourceWord = getWordAtOffset(document.getText(), offset);
  sourceWord; /*?*/

  const viewModelPath = UriUtils.toPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return;

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return;

  const documentSettings = container.get(DocumentSettings);
  const viewExtensions = documentSettings.getSettings().relatedFiles?.view;
  if (!viewExtensions) return;

  const viewPath = getRelatedFilePath(
    UriUtils.toPath(document.uri),
    viewExtensions
  );
  const viewDocument = TextDocumentUtils.createHtmlFromPath(viewPath);
  const regions = await findRegionsByWord(
    aureliaProgram,
    viewDocument,
    sourceWord
  );
  // regions;
  // regions; /*?*/

  const viewRegionDefinitions: LocationLink[] = [];
  for (let region of regions) {
    if (!region.startLine) continue;
    if (!region.startCol) continue;

    const range = Range.create(
      Position.create(region.startLine - 1, region.startCol),
      Position.create(region.startLine, region.startCol)
    );
    const locationLink = LocationLink.create(
      pathToFileURL(viewPath).toString(),
      range,
      range
    );
    viewRegionDefinitions.push(locationLink);
  }

  const regularDefintions =
    findRegularTypescriptDefinitions(aureliaProgram, viewModelPath, offset) ??
    [];

  const finalDefinitions: LocationLink[] = [
    ...viewRegionDefinitions,
    ...regularDefintions,
  ];

  return finalDefinitions;
}

function findRegularTypescriptDefinitions(
  aureliaProgram: AureliaProgram,
  viewModelPath: string,
  offset: number
) {
  const definitions: LocationLink[] = [];

  const tsMorphProject = aureliaProgram.tsMorphProject.get();
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  if (!sourceFile) return;
  const references = tsMorphProject
    .getLanguageService()
    .findReferencesAtPosition(sourceFile, offset);
  references.forEach((reference) => {
    reference.getReferences().forEach((subReference) => {
      const refNode = subReference.getNode();
      const startLine = refNode.getStartLineNumber() - 1;
      const startOffset = refNode.getStart() - 1;
      const startPos = refNode.getStartLinePos() - 1;
      const startCol = startOffset - startPos;
      const endLine = refNode.getEndLineNumber() - 1;
      const endOffset = refNode.getEnd() - 1;
      const endPos = refNode.getStartLinePos() - 1;
      const endCol = endOffset - endPos;

      const range = Range.create(
        Position.create(startLine, startCol),
        Position.create(endLine, endCol)
      );
      const path = subReference.getSourceFile().getFilePath();
      const locationLink = LocationLink.create(
        pathToFileURL(path).toString(),
        range,
        range
      );

      definitions.push(locationLink);
    });
  });

  return definitions;
}
