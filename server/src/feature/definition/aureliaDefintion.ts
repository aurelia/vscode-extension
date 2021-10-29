import { DocumentSpan } from 'ts-morph';
import { pathToFileURL } from 'url';
import { LocationLink, Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getWordAtOffset } from '../../common/documens/find-source-word';
import { getRelatedFilePath } from '../../common/documens/related';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import {
  ViewRegionInfo,
  ViewRegionSubType,
  ViewRegionType,
} from '../../core/embeddedLanguages/embeddedSupport';
import {
  findRegionsByWord,
  forEachRegionOfType,
} from '../../core/regions/findSpecificRegion';
import {
  AureliaProgram,
  IAureliaComponent,
} from '../../core/viewModel/AureliaProgram';
import { DocumentSettings } from '../configuration/DocumentSettings';

export async function aureliaDefinitionFromViewModel(
  container: Container,
  document: TextDocument,
  position: Position
): Promise<LocationLink[] | undefined> {
  const offset = document.offsetAt(position);

  const viewModelPath = UriUtils.toPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return;

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return;

  const finalDefinitions: LocationLink[] = [];
  const regularDefintions =
    findRegularTypescriptDefinitions(aureliaProgram, viewModelPath, offset) ??
    [];
  const isSourceDefinition = getIsSourceDefinition(
    regularDefintions,
    viewModelPath,
    position
  );

  /** Not source, so push source */
  if (!isSourceDefinition) {
    finalDefinitions.push(...regularDefintions);

    return finalDefinitions;
  } else {
    /** Source, so push references */
    const regularReferences =
      findRegularTypescriptReferences(aureliaProgram, viewModelPath, offset) ??
      [];
    finalDefinitions.push(...regularReferences);
  }

  let sourceWord = getWordAtOffset(document.getText(), offset);
  sourceWord; /*?*/
  const targetComponent =
    aureliaProgram.aureliaComponents.getOneBy('className', sourceWord) ??
    aureliaProgram.aureliaComponents.getOneBy(
      'viewModelFilePath',
      viewModelPath
    );
  const targetMember = targetComponent?.classMembers?.find(
    (member) => member.name === sourceWord
  );

  // Class Member
  if (targetMember) {
    const viewRegionDefinitions_ClassMembers = await getAureliaClassMemberDefinitions_SameView(
      container,
      aureliaProgram,
      document,
      sourceWord
    );
    finalDefinitions.push(...viewRegionDefinitions_ClassMembers);

    // Bindable
    const isBindable = targetMember.isBindable;
    if (isBindable) {
      const viewRegionDefinitions_Bindables = await getAureliaClassMemberDefinitions_OtherViewBindables(
        aureliaProgram,
        sourceWord
      );
      finalDefinitions.push(...viewRegionDefinitions_Bindables);
    }
  }
  // Class
  else if (targetComponent) {
    const viewRegionDefinitions_Class: LocationLink[] = await getAureliaClassDefinitions(
      aureliaProgram,
      targetComponent
    );

    finalDefinitions.push(...viewRegionDefinitions_Class);
  }

  return finalDefinitions;
}

async function getAureliaClassDefinitions(
  aureliaProgram: AureliaProgram,
  targetComponent: IAureliaComponent
) {
  const viewRegionDefinitions_Class: LocationLink[] = [];
  await forEachRegionOfType(
    aureliaProgram,
    ViewRegionType.CustomElement,
    (region, document) => {
      if (region.tagName !== targetComponent?.componentName) return;

      const locationLink = createLocationLinkFromRegion(region, document);
      if (!locationLink) return;
      viewRegionDefinitions_Class.push(locationLink);
    }
  );
  return viewRegionDefinitions_Class;
}

async function getAureliaClassMemberDefinitions_SameView(
  container: Container,
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  sourceWord: string
) {
  const documentSettings = container.get(DocumentSettings);
  const viewExtensions = documentSettings.getSettings().relatedFiles?.view;
  if (!viewExtensions) return [];

  const viewPath = getRelatedFilePath(
    UriUtils.toPath(document.uri),
    viewExtensions
  );
  const viewDocument = TextDocumentUtils.createHtmlFromPath(viewPath);
  const viewRegionDefinitions_ClassMembers: LocationLink[] = [];
  const regions = await findRegionsByWord(
    aureliaProgram,
    viewDocument,
    sourceWord
  );

  for (let region of regions) {
    const locationLink = createLocationLinkFromRegion(region, viewDocument);
    if (!locationLink) continue;
    viewRegionDefinitions_ClassMembers.push(locationLink);
  }

  return viewRegionDefinitions_ClassMembers;
}

async function getAureliaClassMemberDefinitions_OtherViewBindables(
  aureliaProgram: AureliaProgram,
  sourceWord: string
) {
  const viewRegionDefinitions_Bindables: LocationLink[] = [];
  await forEachRegionOfType(
    aureliaProgram,
    ViewRegionType.CustomElement,
    (region, document) => {
      region.data?.forEach((subRegion) => {
        if (subRegion.type !== ViewRegionType.BindableAttribute) return;
        if (subRegion.regionValue !== sourceWord) return;

        const locationLink = createLocationLinkFromRegion(subRegion, document);
        if (!locationLink) return;
        viewRegionDefinitions_Bindables.push(locationLink);
      });
    }
  );
  return viewRegionDefinitions_Bindables;
}

function findRegularTypescriptDefinitions(
  aureliaProgram: AureliaProgram,
  viewModelPath: string,
  offset: number
) {
  const finalDefinitions: LocationLink[] = [];
  const tsMorphProject = aureliaProgram.tsMorphProject.get();
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  if (!sourceFile) return;
  const sourceDefinitions = tsMorphProject
    .getLanguageService()
    .getDefinitionsAtPosition(sourceFile, offset);

  sourceDefinitions.find((definition) => {
    const locationLink = createLocationLinkFromDocumentSpan(definition);
    finalDefinitions.push(locationLink);
  });

  return finalDefinitions;
}

function findRegularTypescriptReferences(
  aureliaProgram: AureliaProgram,
  viewModelPath: string,
  offset: number
) {
  const finalReferences: LocationLink[] = [];
  const tsMorphProject = aureliaProgram.tsMorphProject.get();
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  if (!sourceFile) return;
  const references = tsMorphProject
    .getLanguageService()
    .findReferencesAtPosition(sourceFile, offset);
  references.forEach((reference) => {
    reference.getReferences().forEach((subReference) => {
      const locationLink = createLocationLinkFromDocumentSpan(subReference);
      finalReferences.push(locationLink);
    });
  });

  return finalReferences;
}

function createLocationLinkFromDocumentSpan(documentSpan: DocumentSpan) {
  const refNode = documentSpan.getNode();
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
  const path = documentSpan.getSourceFile().getFilePath();
  const locationLink = LocationLink.create(
    pathToFileURL(path).toString(),
    range,
    range
  );
  return locationLink;
}

function createLocationLinkFromRegion(
  region: ViewRegionInfo,
  document: TextDocument
) {
  if (!region.startLine) return;
  if (!region.startCol) return;
  if (!region.endLine) return;
  if (!region.endCol) return;

  const range = Range.create(
    Position.create(region.startLine - 1, region.startCol - 1),
    Position.create(region.endLine - 1, region.endCol - 1)
  );
  const locationLink = LocationLink.create(
    document.uri.toString(),
    range,
    range
  );

  return locationLink;
}

function getIsSourceDefinition(
  definitions: LocationLink[],
  viewModelPath: string,
  position: Position
) {
  const targetDefinition = definitions.find((definition) => {
    definition.targetUri;

    const { start, end } = definition.targetRange;
    const _isIncludedPosition = isIncludedPosition(start, end, position);
    const isSamePath = definition.targetUri === UriUtils.toUri(viewModelPath);

    const isSourceDefinition = _isIncludedPosition && isSamePath;
    return isSourceDefinition;
  });

  return targetDefinition;
}

function isIncludedPosition(start: Position, end: Position, target: Position) {
  const projectedStart = projectPosision(start);
  const projectedEnd = projectPosision(end);
  const projectedSources = projectPosision(target);
  const isIncluded =
    projectedStart <= projectedSources && projectedSources <= projectedEnd;

  return isIncluded;
}

/**
 * Project 2dim line x character to a 1dim value
 */
function projectPosision(position: Position) {
  const projection = position.line * 100000 + position.character;
  return projection;
}
