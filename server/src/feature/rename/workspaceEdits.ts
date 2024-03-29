import * as fs from 'fs';
import path from 'path';

import { SyntaxKind } from '@ts-morph/common';
import { camelCase, kebabCase } from 'lodash';
import { WorkspaceEdit, TextEdit, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProgram } from '../../aot/AureliaProgram';
import {
  findAllBindableAttributeRegions,
  findRegionsByWord,
  forEachRegionOfType,
} from '../../aot/parser/regions/findSpecificRegion';
import {
  getRangesForAccessScopeFromRegionByName,
  getRangeFromDocumentOffsets,
  getRangeFromLocation,
  getRangeFromRegion,
  getStartTagNameRange,
} from '../../aot/parser/regions/rangeFromRegion';
import {
  ViewRegionSubType,
  ViewRegionType,
} from '../../aot/parser/regions/ViewRegions';
import { getClass, getClassMember } from '../../aot/tsMorph/tsMorphClass';
import { CUSTOM_ELEMENT_SUFFIX } from '../../common/constants';
import { Logger } from '../../common/logging/logger';
import { UriUtils } from '../../common/view/uri-utils';
import { Container } from '../../core/container';
import { updateTsMorphProjectWithEditingFiles } from '../definition/aureliaDefintion';

const logger = new Logger('workspaceEdits');

export async function getAllChangesForOtherViews(
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
    await forEachRegionOfType(
      aureliaProgram,
      ViewRegionType.CustomElement,
      (region, document) => {
        if (region.tagName !== targetComponent?.componentName) return;
        if (result[document.uri] === undefined) {
          result[document.uri] = [];
        }

        if (region.subType === ViewRegionSubType.StartTag) {
          // From Start tag sub region, just get location info of tag name
          // (we account (multi-lined) attributes as well)
          const range = getStartTagNameRange(region, document);
          if (!range) return;

          result[document.uri].push(TextEdit.replace(range, newName));
          return;
        }

        const range = getRangeFromRegion(region);
        if (!range) return;

        result[document.uri].push(TextEdit.replace(range, newName));
      }
    );
    return result;
  }

  // 2.2 Find rename locations - Bindable attributes
  const bindableRegions = await findAllBindableAttributeRegions(
    aureliaProgram,
    sourceWord
  );

  Object.entries(bindableRegions).forEach(([uri, regions]) => {
    regions.forEach((region) => {
      const range = getRangeFromRegion(region);
      if (!range) return;
      if (result[uri] === undefined) result[uri] = [];

      result[uri].push(TextEdit.replace(range, kebabCase(newName)));
    });
  });

  return result;
}

export function performViewModelChanges(
  container: Container,
  aureliaProgram: AureliaProgram,
  viewModelPath: string,
  sourceWord: string,
  newName: string,
): WorkspaceEdit['changes'] {
  // 1. Prepare
  // 1.1 Naming convention
  let finalNewName = newName;
  const finalComponentName = newName;
  if (sourceWord.endsWith(CUSTOM_ELEMENT_SUFFIX)) {
    finalNewName = newName.concat(CUSTOM_ELEMENT_SUFFIX);
  } else if (newName.endsWith(CUSTOM_ELEMENT_SUFFIX)) {
    finalComponentName.replace(CUSTOM_ELEMENT_SUFFIX, '');
  }

  // 1.2
  const result: WorkspaceEdit['changes'] = {};
  const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
    'viewModelFilePath',
    viewModelPath
  );
  if (!targetComponent) return;

  const tsMorphProject = aureliaProgram.tsMorphProject.get();

  // 1.3 Update TsMorphProject with editingFiles
  updateTsMorphProjectWithEditingFiles(container, tsMorphProject);

  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  const viewModelUri = UriUtils.toVscodeUri(viewModelPath);
  result[viewModelUri] = [];

  const className = targetComponent?.className ?? '';
  const classNode = getClass(sourceFile, className);
  const content = fs.readFileSync(viewModelPath, 'utf-8');
  const viewModelDocument = TextDocument.create(
    viewModelUri,
    'html',
    0,
    content
  );

  // 2.1 Find rename locations - Class Declaration
  const isCustomElementClass = className === sourceWord;
  if (isCustomElementClass) {
    // 2.1.1 Custom element decorator
    const range = getRangeFromDocumentOffsets(
      viewModelDocument,
      targetComponent.decoratorStartOffset,
      targetComponent.decoratorEndOffset
    );
    if (range) {
      result[viewModelUri].push(
        TextEdit.replace(range, kebabCase(finalComponentName))
      );
    }

    // 2.1.2 References and original Class
    const classIdentifier = classNode.getFirstChildByKind(
      SyntaxKind.Identifier
    );
    if (!classIdentifier) return;
    const renameLocations = tsMorphProject
      .getLanguageService()
      .findRenameLocations(classIdentifier);
    renameLocations.forEach((location) => {
      const range = getRangeFromLocation(location);
      const referencePath = location.getSourceFile().getFilePath();
      const referenceUri = UriUtils.toVscodeUri(referencePath);
      if (result[referenceUri] === undefined) result[referenceUri] = [];
      if (result === undefined) return;

      result[referenceUri].push(TextEdit.replace(range, finalNewName));
    });

    // result; /*?*/
    return result;
  }

  // 2.2 Find rename locations - Class Members
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

      result[viewModelUri].push(TextEdit.replace(range, finalNewName));
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
   */
  if (typeof targetAureliaFile?.fileName === 'string') {
    return UriUtils.toSysPath(targetAureliaFile.fileName);
  }
}

export async function renameAllOtherRegionsInSameView(
  aureliaProgram: AureliaProgram,
  viewDocument: TextDocument,
  sourceWord: string,
  newName: string
) {
  const result: WorkspaceEdit['changes'] = {};

  const regions = await findRegionsByWord(
    aureliaProgram,
    viewDocument,
    sourceWord
  );

  const { uri } = viewDocument;
  result[uri] = [];
  regions.forEach((region) => {
    const accessScopeRanges = getRangesForAccessScopeFromRegionByName(
      viewDocument,
      region,
      sourceWord
    );

    accessScopeRanges?.forEach((range) => {
      if (range === undefined) return;

      result[uri].push(TextEdit.replace(range, camelCase(newName)));
    });
  });

  return result;
}
