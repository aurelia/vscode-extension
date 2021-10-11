import * as path from 'path';
import * as fs from 'fs';
import {
  Range,
  TextDocumentEdit,
  TextEdit,
  WorkspaceEdit,
} from 'vscode-languageserver';

import {
  RepeatForRegionData,
  ViewRegionInfo,
  ViewRegionType,
} from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import {
  findAllBindableRegions,
  findRegionsWithValue,
} from '../../../core/regions/find-specific-region';
import { findSourceWord } from '../../../common/documens/find-source-word';
import { getClass, getClassMember } from '../../ts-morph/ts-morph-class';
import { camelCase } from 'lodash';
import { getRelatedFilePath } from '../../../common/documens/related';
import { pathToFileURL } from 'url';
import { ExtensionSettings } from '../../../feature/configuration/DocumentSettings';
import { AureliaProgram } from '../../viewModel/AureliaProgram';

export function getBindableAttributeMode(
  aureliaProgram: AureliaProgram,
  extensionSettings: ExtensionSettings
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.BindableAttribute;
    },

    async doRename(
      document: TextDocument,
      position: Position,
      newName: string,
      region: ViewRegionInfo
    ) {
      if (!region.startCol) return;
      if (!region.endCol) return;

      const { line } = position;
      const startPosition = Position.create(line - 1, region.startCol - 1);
      const endPosition = Position.create(line - 1, region.endCol - 1);
      const range = Range.create(startPosition, endPosition);

      // 1. rename view model
      const offset = document.offsetAt(position);
      const sourceWord = findSourceWord(region, offset);
      const viewModelPath = getViewModelPathFromTagName(region.tagName ?? '')!;
      performViewModelChanges(viewModelPath, sourceWord, camelCase(newName));

      // 2. rename all others
      const otherComponentChanges = await getAllOtherChangesForComponentsWithBindable(
        sourceWord,
        newName
      );

      // 3. rename all regions in view of target custom element
      // 3.1 Get document of corresponding view
      const componentList = aureliaProgram.aureliaComponents.get();
      const targetComponent = componentList.find(
        (component) => component.viewModelFilePath === viewModelPath
      );
      if (!targetComponent) return;

      const viewFilePath = targetComponent.viewFilePath ?? '';
      const uri = pathToFileURL(viewFilePath).toString();
      const content = fs.readFileSync(viewFilePath, 'utf-8');
      const viewDocument = TextDocument.create(uri, 'html', 0, content);
      if (!viewDocument) return;

      const otherChangesInsideSameView = await renameAllOtherRegionsInSameView(
        viewDocument,
        sourceWord,
        newName
      );

      return {
        changes: {
          [document.uri]: [TextEdit.replace(range, newName)],
          ...otherComponentChanges,
          ...otherChangesInsideSameView,
        },

        // documentChanges: [
        //   TextDocumentEdit.create(
        //     { version: document.version + 1, uri: document.uri },
        //     [TextEdit.replace(range, newName)]
        //   ),
        // ],
      };
    },

    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };

  async function getAllOtherChangesForComponentsWithBindable(
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

  function performViewModelChanges(
    viewModelPath: string,
    sourceWord: string,
    newName: string
  ) {
    const components = aureliaProgram.aureliaComponents.get();
    const targetComponent = components.find(
      (component) => component.viewModelFilePath === viewModelPath
    );

    const tsMorphProject = aureliaProgram.getTsMorphProject();
    const sourceFile = tsMorphProject.getSourceFile(viewModelPath);
    const className = targetComponent?.className ?? '';
    const classNode = getClass(sourceFile, className);
    const classMemberNode = getClassMember(classNode, sourceWord);
    classMemberNode?.rename(newName);
    tsMorphProject.saveSync();
  }

  function getViewModelPathFromTagName(tagName: string): string | undefined {
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

  async function renameAllOtherRegionsInSameView(
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

    result; /*?*/
    return result;
  }
}

function getRangeFromRegion(
  region: ViewRegionInfo,
  document?: TextDocument
): Range | undefined {
  let range;
  if (document) {
    range = getRangeFromRegionViaDocument(region, document);
  } else {
    range = getRangeFromStandardRegion(region, range);
  }

  return range;
}

function getRangeFromStandardRegion(region: ViewRegionInfo<any>, range: any) {
  if (!region.startCol) return;
  if (!region.startLine) return;
  if (!region.endCol) return;
  if (!region.endLine) return;

  const startPosition = Position.create(
    region.startLine - 1,
    region.startCol - 1
  );
  const endPosition = Position.create(region.endLine - 1, region.endCol - 1);
  range = Range.create(startPosition, endPosition);

  return range;
}

function getRangeFromRegionViaDocument(
  region: ViewRegionInfo,
  document: TextDocument
) {
  if (!region.startOffset) return;
  if (!region.endOffset) return;

  let startPosition;
  let endPosition;
  let range;

  if (region.type === ViewRegionType.RepeatFor) {
    range = getRangeFromRepeatForRegion(region, document);
  } else {
    startPosition = document.positionAt(region.startOffset);
    endPosition = document.positionAt(region.endOffset - 1);
    range = Range.create(startPosition, endPosition);
  }

  return range;
}

function getRangeFromRepeatForRegion(
  region: ViewRegionInfo<any>,
  document: TextDocument
): any {
  const repeatForRegion = region as ViewRegionInfo<RepeatForRegionData>;
  if (!repeatForRegion.data) return;

  const startPosition = document.positionAt(
    repeatForRegion.data.iterableStartOffset
  );
  const endPosition = document.positionAt(
    repeatForRegion.data.iterableEndOffset - 1
  );
  const range = Range.create(startPosition, endPosition);

  return range;
}
