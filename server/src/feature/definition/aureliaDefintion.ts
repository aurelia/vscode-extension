import { pathToFileURL } from 'url';

import { DocumentSpan, Project, SyntaxKind } from 'ts-morph';
import { LocationLink, Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { IAureliaComponent } from '../../aot/aotTypes';
import { AureliaProgram } from '../../aot/AureliaProgram';
import {
  findRegionsByWord,
  forEachRegionOfType,
} from '../../aot/parser/regions/findSpecificRegion';
import {
  AbstractRegion,
  ViewRegionSubType,
  ViewRegionType,
} from '../../aot/parser/regions/ViewRegions';
import { AureliaUtils } from '../../common/AureliaUtils';
import { getWordAtOffset } from '../../common/documens/find-source-word';
import { PositionUtils } from '../../common/documens/PositionUtils';
import { getRelatedFilePath } from '../../common/documens/related';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { DocumentSettings } from '../configuration/DocumentSettings';

/**
 * 1. Only allow for Class or Bindable
 * 2. For Bindable, check if source or reference
 * 3. Find references in own and other Views
 */
export async function aureliaDefinitionFromViewModel(
  container: Container,
  document: TextDocument,
  position: Position
): Promise<LocationLink[] | undefined> {
  const offset = document.offsetAt(position);

  const viewModelPath = UriUtils.toSysPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return;

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return;

  const tsMorphProject = aureliaProgram.tsMorphProject.get();
  const sourceWord = getWordAtOffset(document.getText(), offset);
  const targetComponent =
    aureliaProgram.aureliaComponents.getOneBy('className', sourceWord) ??
    aureliaProgram.aureliaComponents.getOneBy(
      'viewModelFilePath',
      viewModelPath
    );

  // 1. Only for Class and Bindables
  const isIdentifier = getIsIdentifier(tsMorphProject, viewModelPath, offset);
  if (!isIdentifier) return;

  // 1.1 Update TsMorphProject with editingFiles
  updateTsMorphProjectWithEditingFiles(container, tsMorphProject);

  const regularDefintions =
    findRegularTypescriptDefinitions(tsMorphProject, viewModelPath, offset) ??
    [];
  const sourceDefinition = getSourceDefinition(
    regularDefintions,
    viewModelPath,
    position
  );

  const finalDefinitions: LocationLink[] = [];

  /** Not source, so default */
  if (!sourceDefinition) return;

  // Note, we need to handle references (instead of just letting it be the job of the TS Server),
  // because as long as we only return one valid defintion, the "default" suggestions are not returned
  // to the client anymore.
  // I made sure to test this out throughly by just returning one definition (any defintion data), then
  // check the client (ie. trigger suggestion inside a .ts file in VSCode).
  /** Source, so push references */
  const regularReferences =
    findRegularTypescriptReferences(aureliaProgram, viewModelPath, offset) ??
    [];
  // We filter out the definition source, else it would be duplicated
  const withoutTriggerDefinition = filterOutTriggerDefinition(
    regularReferences,
    sourceDefinition
  );
  finalDefinitions.push(...withoutTriggerDefinition);

  const targetMember = targetComponent?.classMembers?.find(
    (member) => member.name === sourceWord
  );

  // Class Member
  if (targetMember) {
    const viewRegionDefinitions_ClassMembers =
      await getAureliaClassMemberDefinitions_SameView(
        container,
        aureliaProgram,
        document,
        sourceWord
      );
    finalDefinitions.push(...viewRegionDefinitions_ClassMembers);

    // Bindable
    const isBindable = targetMember.isBindable;
    if (isBindable) {
      const viewRegionDefinitions_Bindables =
        await getAureliaClassMemberDefinitions_OtherViewBindables(
          aureliaProgram,
          sourceWord
        );
      finalDefinitions.push(...viewRegionDefinitions_Bindables);
    }
  }
  // Class
  else if (targetComponent) {
    const viewRegionDefinitions_Class: LocationLink[] =
      await getAureliaCustomElementDefinitions_OtherViews(
        aureliaProgram,
        targetComponent
      );

    finalDefinitions.push(...viewRegionDefinitions_Class);
  }

  return finalDefinitions;
}

async function getAureliaCustomElementDefinitions_OtherViews(
  aureliaProgram: AureliaProgram,
  targetComponent: IAureliaComponent
) {
  const viewRegionDefinitions_Class: LocationLink[] = [];
  await forEachRegionOfType(
    aureliaProgram,
    ViewRegionType.CustomElement,
    (region, document) => {
      if (region.tagName !== targetComponent?.componentName) return;
      if (region.subType === ViewRegionSubType.EndTag) return;

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
    UriUtils.toSysPath(document.uri),
    viewExtensions
  );
  const viewDocument = TextDocumentUtils.createHtmlFromPath(viewPath);
  const viewRegionDefinitions_ClassMembers: LocationLink[] = [];
  const regions = await findRegionsByWord(
    aureliaProgram,
    viewDocument,
    sourceWord
  );

  for (const region of regions) {
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
        if (!AureliaUtils.isSameVariableName(subRegion.regionValue, sourceWord))
          return;

        const locationLink = createLocationLinkFromRegion(subRegion, document);
        if (!locationLink) return;
        viewRegionDefinitions_Bindables.push(locationLink);
      });
    }
  );
  return viewRegionDefinitions_Bindables;
}

function findRegularTypescriptDefinitions(
  tsMorphProject: Project,
  viewModelPath: string,
  offset: number
) {
  const finalDefinitions: LocationLink[] = [];
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  if (!sourceFile) return;
  const sourceDefinitions = tsMorphProject
    .getLanguageService()
    .getDefinitionsAtPosition(sourceFile, offset);

  sourceDefinitions.forEach((definition) => {
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
  region: AbstractRegion,
  document: TextDocument
) {
  if (region.sourceCodeLocation === undefined) return;
  const { startLine, startCol, endLine, endCol } = region.sourceCodeLocation;

  const range = Range.create(
    Position.create(startLine, startCol),
    Position.create(endLine, endCol)
  );
  const locationLink = LocationLink.create(
    document.uri.toString(),
    range,
    range
  );

  return locationLink;
}

/**
 * Given a position, check if the defintion is the source.
 * (If not source, then it would be a reference.)
 */
function getSourceDefinition(
  definitions: LocationLink[],
  viewModelPath: string,
  position: Position
) {
  const targetDefinition = definitions.find((definition) => {
    const { start, end } = definition.targetRange;
    const isIncludedPosition = PositionUtils.isIncluded(start, end, position);
    const isSamePath =
      UriUtils.toSysPath(definition.targetUri) ===
      UriUtils.toSysPath(viewModelPath);

    const isSourceDefinition = isIncludedPosition && isSamePath;
    return isSourceDefinition;
  });

  return targetDefinition;
}

function getIsIdentifier(
  tsMorphProject: Project,
  viewModelPath: string,
  offset: number
) {
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  const descandant = sourceFile?.getDescendantAtPos(offset);
  const is = descandant?.getKind() === SyntaxKind.Identifier;

  return is;
}

function filterOutTriggerDefinition(
  regularReferences: LocationLink[],
  sourceDefinition: LocationLink
) {
  const withoutTriggerDefinition = regularReferences.filter((reference) => {
    const referenceIsInSameUri =
      reference.targetUri === sourceDefinition.targetUri;
    if (!referenceIsInSameUri) return true;

    const { targetRange, targetSelectionRange } = reference;
    const sameRange = isSameRange(targetRange, sourceDefinition.targetRange);
    const sameSelectionRange = isSameRange(
      targetSelectionRange,
      sourceDefinition.targetSelectionRange
    );

    const same = sameRange && sameSelectionRange;
    return !same;
  });

  return withoutTriggerDefinition;
}

function isSameRange(rangeA: Range, rangeB: Range) {
  const sameStartChar = rangeA.start.character === rangeB.start.character;
  const sameStartLine = rangeA.start.line === rangeB.start.line;
  const sameEndChar = rangeA.end.character === rangeB.end.character;
  const sameEndLine = rangeA.end.line === rangeB.end.line;

  const same = sameStartChar && sameStartLine && sameEndChar && sameEndLine;

  return same;
}

export function updateTsMorphProjectWithEditingFiles(
  container: Container,
  tsMorphProject: Project
) {
  const aureliaProjects = container.get(AureliaProjects);
  const editingDocuments = aureliaProjects.getEditingTracker();

  editingDocuments.forEach((doc) => {
    const osPath = UriUtils.toSysPath(doc.uri);
    const sourceFile = tsMorphProject.getSourceFile(osPath);

    try {
      const realTimeEditingContent = doc.getText();
      sourceFile?.replaceWithText(realTimeEditingContent);
    } catch (_error) {
      // const error = _error as Error;
      // console.log('TCL: error.message', error.message);
    }
  });
}
