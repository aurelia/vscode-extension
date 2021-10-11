import * as path from 'path';

import { camelCase } from 'lodash';
import { TextDocumentPositionParams } from 'vscode-languageserver';

import { findSourceWord } from '../../../common/documens/find-source-word';
import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import { getBindablesCompletion } from '../../../feature/completions/completions';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getVirtualDefinition } from '../../../feature/definition/virtualDefinition';
import { AureliaProgram } from '../../viewModel/AureliaProgram';

export function getCustomElementMode(
  aureliaProgram: AureliaProgram
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.CustomElement;
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter: string | undefined,
      region?: ViewRegionInfo
    ) {
      if (triggerCharacter === ' ') {
        const bindablesCompletion = await getBindablesCompletion(
          aureliaProgram,
          _textDocumentPosition,
          document,
          region
        );
        if (bindablesCompletion.length > 0) return bindablesCompletion;
      }
      return [];
    },
    async doDefinition(
      document: TextDocument,
      position: Position,
      customElementRegion: ViewRegionInfo
    ): Promise<DefinitionResult | undefined> {
      document.getText(); /*?*/
      position; /*?*/
      const offset = document.offsetAt(position);
      offset; /*?*/
      const goToSourceWord = findSourceWord(customElementRegion, offset);
      goToSourceWord; /*?*/

      const aureliaSourceFiles = aureliaProgram.getAureliaSourceFiles();
      aureliaSourceFiles?.map((file) => file.fileName); /*?*/
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
          return filePathName === customElementRegion?.tagName;
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
