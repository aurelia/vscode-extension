import {
  ViewRegionInfo,
  ViewRegionType,
} from '../embeddedSupport';
import * as path from 'path';

import { TextDocumentPositionParams } from 'vscode-languageserver';

import { LanguageMode, Position, TextDocument } from '../languageModes';
import { getBindablesCompletion } from '../../completions/completions';
import { aureliaProgram } from '../../../viewModel/AureliaProgram';
import { DefinitionResult } from '../../definition/getDefinition';
import { camelCase } from 'lodash';
import { getVirtualDefinition } from '../../definition/virtualDefinition';

export function getCustomElementMode(
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.CustomElement;
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter: string | undefined
    ) {
      if (triggerCharacter === ' ') {
        const bindablesCompletion = await getBindablesCompletion(
          _textDocumentPosition,
          document
        );
        if (bindablesCompletion.length > 0) return bindablesCompletion;
      }
      return [];
    },
    async doDefinition(
      document: TextDocument,
      position: Position,
      goToSourceWord: string,
      customElementRegion: ViewRegionInfo | undefined
    ): Promise<DefinitionResult | undefined> {
      const aureliaSourceFiles = aureliaProgram.getAureliaSourceFiles();
      const targetAureliaFile = aureliaSourceFiles?.find((sourceFile) => {
        return path.parse(sourceFile.fileName).name === goToSourceWord;
      });

      /**
       * 1. Triggered on <|my-component>
       * */
      if (typeof targetAureliaFile?.fileName === 'string') {
        return {
          lineAndCharacter: {
            line: 1,
            character: 1,
          } /** TODO: Find class declaration position. Currently default to top of file */,
          viewModelFilePath: targetAureliaFile?.fileName,
        };
      }

      /**
       * 2. >inter-bindable<.bind="increaseCounter()"
       */
      /** Source file different from view */
      const targetAureliaFileDifferentViewModel = aureliaSourceFiles?.find(
        (sourceFile) => {
          const filePathName = path.parse(sourceFile.fileName).name;
          return (
            filePathName === customElementRegion?.tagName
          );
        }
      );

      if (targetAureliaFileDifferentViewModel === undefined) return;

      const sourceWordCamelCase = camelCase(goToSourceWord);

      return getVirtualDefinition(
        targetAureliaFileDifferentViewModel.fileName,
        aureliaProgram,
        sourceWordCamelCase
      );

      return;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDocumentRemoved(_document: TextDocument) {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose() {},
  };
}
