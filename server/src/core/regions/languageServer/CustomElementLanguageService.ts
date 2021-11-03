import * as path from 'path';

import { camelCase } from 'lodash';
import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { findSourceWord } from '../../../common/documens/find-source-word';
import { getBindablesCompletion } from '../../../feature/completions/completions';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getVirtualDefinition } from '../../../feature/definition/virtualDefinition';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';
import { AbstractRegion } from '../ViewRegions';

export class CustomElementLanguageService
  implements AbstractRegionLanguageService {
  async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    _textDocumentPosition: TextDocumentPositionParams,
    triggerCharacter: string | undefined,
    region?: AbstractRegion
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
  }

  async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    customElementRegion: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    document.getText(); /* ? */
    position; /* ? */
    const offset = document.offsetAt(position);
    offset; /* ? */
    const goToSourceWord = findSourceWord(customElementRegion, offset);
    goToSourceWord; /* ? */

    const aureliaSourceFiles = aureliaProgram.getAureliaSourceFiles();
    aureliaSourceFiles?.map((file) => file.fileName); /* ? */
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
  }
}
