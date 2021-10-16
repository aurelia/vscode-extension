import { SyntaxKind } from '@ts-morph/common';
import * as fs from 'fs';
import { kebabCase } from 'lodash';
import path from 'path';
import { pathToFileURL } from 'url';
import {
  WorkspaceEdit,
  TextEdit,
  Range,
  Position,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Logger } from '../../common/logging/logger';
import { ViewRegionType } from '../../core/embeddedLanguages/embeddedSupport';
import {
  findAllBindableAttributeRegions,
  findRegionsWithValue,
  forEachRegion,
} from '../../core/regions/findSpecificRegion';
import { getRangeFromRegion } from '../../core/regions/rangeFromRegion';
import { getClass, getClassMember } from '../../core/tsMorph/tsMorphClass';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';

const logger = new Logger('workspaceEdits');

export async function getAllChangesForOtherCustomElements(
  aureliaProgram: AureliaProgram,
  viewModelPath: string,
  sourceWord: string,
  newName: string
) {
  const result: WorkspaceEdit['changes'] = {};
  const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
    'viewModelFilePath',
    viewModelPath
  );
  const className = targetComponent?.className ?? '';

  // 2.1 Find rename locations - Custom element tag
  const isCustomElement = className === sourceWord;
  if (isCustomElement) {
    forEachRegion(
      aureliaProgram,
      ViewRegionType.CustomElement,
      (regions, document) => {
        regions.forEach((region) => {
          if (region.tagName === targetComponent?.componentName) {
            const range = getRangeFromRegion(region);
            if (!range) return;

            if (result[document.uri] === undefined) {
              result[document.uri] = [];
            }

            if (region.type === ViewRegionType.CustomElement) {
              result[document.uri].push(
                TextEdit.replace(range, kebabCase(newName))
              );
            }
          }
        });
      }
    );
    return result;
  }

  // 2.1 Find rename locations - Bindable attributes
  const bindableRegions = await findAllBindableAttributeRegions(
    aureliaProgram,
    sourceWord
  );

  Object.entries(bindableRegions).forEach(([uri, regions]) => {
    regions.forEach((region) => {
      const range = getRangeFromRegion(region);
      if (!range) return;

      result[uri].push(TextEdit.replace(range, kebabCase(newName)));
    });
  });

  return result;
}

export function performViewModelChanges(
  aureliaProgram: AureliaProgram,
  viewModelPath: string,
  sourceWord: string,
  newName: string
): WorkspaceEdit['changes'] {
  // 1. Prepare
  const result: WorkspaceEdit['changes'] = {};
  const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
    'viewModelFilePath',
    viewModelPath
  );

  const tsMorphProject = aureliaProgram.getTsMorphProject();
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  const viewModelUri = pathToFileURL(viewModelPath).toString();
  result[viewModelUri] = [];

  const className = targetComponent?.className ?? '';
  const classNode = getClass(sourceFile, className);

  // 2.1 Find rename locations - Class Declaration
  const isCustomElement = className === sourceWord;
  if (isCustomElement) {
    const classIdentifier = classNode.getFirstChildByKind(
      SyntaxKind.Identifier
    );
    if (!classIdentifier) return;

    // 2.1.1 References
    const renameLocations = tsMorphProject
      .getLanguageService()
      .findRenameLocations(classNode);

    renameLocations.forEach((location) => {
      const textSpan = location.getTextSpan();
      const startPosition = viewModelDocument.positionAt(textSpan.getStart());
      const endPosition = viewModelDocument.positionAt(textSpan.getEnd());
      const range = Range.create(startPosition, endPosition);

      result[viewModelUri].push(TextEdit.replace(range, newName));
    });

    // 2.1.2 Class name
    const startPosition = Position.create(
      classIdentifier.getStartLineNumber(),
      classIdentifier.getStart()
    );
    const endPosition = Position.create(
      classIdentifier.getEndLineNumber(),
      classIdentifier.getEnd()
    );
    const range = Range.create(startPosition, endPosition);
    range; /*?*/
    result[viewModelUri].push(TextEdit.replace(range, newName));

    return result;
  }

  // 2.2 Find rename locations - Class Members
  const content = fs.readFileSync(viewModelPath, 'utf-8');
  const viewModelDocument = TextDocument.create(
    viewModelUri,
    'html',
    0,
    content
  );
  const classMemberNode = getClassMember(classNode, sourceWord);
  if (classMemberNode) {
    const renameLocations = tsMorphProject
      .getLanguageService()
      .findRenameLocations(classMemberNode);

    renameLocations.forEach((location) => {
      const textSpan = location.getTextSpan();
      const startPosition = viewModelDocument.positionAt(textSpan.getStart());
      const endPosition = viewModelDocument.positionAt(textSpan.getEnd());
      const range = Range.create(startPosition, endPosition);

      result[viewModelUri].push(TextEdit.replace(range, newName));
    });
  } else {
    logger.log('Error: No class member found');
  }

  return result;
}

export function getViewModelPathFromTagName(
  aureliaProgram: AureliaProgram,
  tagName: string
): string | undefined {
  const aureliaSourceFiles = aureliaProgram.getAureliaSourceFiles();
  const targetAureliaFile = aureliaSourceFiles?.find((sourceFile) => {
    return path.parse(sourceFile.fileName).name === tagName;
  });

  /**
   * 1. Triggered on <|my-component>
   * */
  if (typeof targetAureliaFile?.fileName === 'string') {
    return targetAureliaFile.fileName;
  }
}

export async function renameAllOtherRegionsInSameView(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  sourceWord: string,
  newName: string
) {
  const result: WorkspaceEdit['changes'] = {};

  const regions = await findRegionsWithValue(
    aureliaProgram,
    document,
    sourceWord
  );

  const { uri } = document;
  result[uri] = [];
  regions.forEach((region) => {
    const range = getRangeFromRegion(region, document);
    if (!range) return;

    result[uri].push(TextEdit.replace(range, newName));
  });

  return result;
}
