import * as fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { WorkspaceEdit, TextEdit, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Logger } from '../../common/logging/logger';
import {
  findAllBindableRegions,
  findRegionsWithValue,
} from '../../core/regions/findSpecificRegion';
import { getRangeFromRegion } from '../../core/regions/rangeFromRegion';
import { getClass, getClassMember } from '../../core/tsMorph/tsMorphClass';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';

const logger = new Logger('workspaceEdits');

export async function getAllOtherChangesForComponentsWithBindable(
  aureliaProgram: AureliaProgram,
  bindableName: string,
  newName: string
) {
  const bindableRegions = await findAllBindableRegions(
    aureliaProgram,
    bindableName
  );

  const result: WorkspaceEdit['changes'] = {};
  Object.entries(bindableRegions).forEach(([uri, regions]) => {
    regions.forEach((region) => {
      const range = getRangeFromRegion(region);
      if (!range) return;

      if (result[uri] === undefined) {
        result[uri] = [];
      }
      result[uri].push(TextEdit.replace(range, newName));
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
  const components = aureliaProgram.aureliaComponents.get();
  const targetComponent = components.find(
    (component) => component.viewModelFilePath === viewModelPath
  );
  const tsMorphProject = aureliaProgram.getTsMorphProject();
  const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
  const uri = pathToFileURL(viewModelPath).toString();
  result[uri] = [];
  const content = fs.readFileSync(viewModelPath, 'utf-8');
  const viewModelDocument = TextDocument.create(uri, 'html', 0, content);
  const className = targetComponent?.className ?? '';
  const classNode = getClass(sourceFile, className);
  const classMemberNode = getClassMember(classNode, sourceWord);

  // 2. Find rename locations
  if (classMemberNode) {
    const renameLocations = tsMorphProject
      .getLanguageService()
      .findRenameLocations(classMemberNode);

    renameLocations.forEach((location) => {
      const textSpan = location.getTextSpan();
      const startPosition = viewModelDocument.positionAt(textSpan.getStart());
      const endPosition = viewModelDocument.positionAt(textSpan.getEnd());
      const range = Range.create(startPosition, endPosition);

      result[uri].push(TextEdit.replace(range, newName));
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
