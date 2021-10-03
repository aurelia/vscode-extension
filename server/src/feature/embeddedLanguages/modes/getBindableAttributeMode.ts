import * as path from 'path';
import {
  Range,
  TextDocumentEdit,
  TextEdit,
  WorkspaceEdit,
} from 'vscode-languageserver';

import { AureliaProgram } from '../../../viewModel/AureliaProgram';
import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import { findAllBindableRegions } from '../../../core/regions/find-specific-region';
import { findSourceWord } from '../../../common/documens/find-source-word';
import { ExtensionSettings } from '../../../configuration/DocumentSettings';
import {
  getClass,
  getClassMember,
} from '../../../common/ts-morph/ts-morph-class';
import { camelCase } from 'lodash';

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

      // rename view model
      const offset = document.offsetAt(position);
      const sourceWord = findSourceWord(region, offset);
      const viewModelPath = getViewModelPathFromTagName(region.tagName ?? '')!;
      performViewModelChanges(viewModelPath, sourceWord, camelCase(newName));

      // rename all others
      const otherComponentChanges = await getAllOtherChangesForComponentsWithBindable(
        aureliaProgram,
        sourceWord,
        newName
      );

      return {
        changes: {
          [document.uri]: [TextEdit.replace(range, newName)],
          ...otherComponentChanges,
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
        if (!region.startCol) return;
        if (!region.startLine) return;
        if (!region.endCol) return;
        if (!region.endLine) return;

        const startPosition = Position.create(
          region.startLine - 1,
          region.startCol - 1
        );
        const endPosition = Position.create(
          region.endLine - 1,
          region.endCol - 1
        );
        const range = Range.create(startPosition, endPosition);

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
    const components = aureliaProgram.getComponentList();

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

  function getViewModelPathFromTagName(tagName: string) {
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
}
