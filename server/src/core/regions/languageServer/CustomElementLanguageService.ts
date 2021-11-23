import * as path from 'path';

import { camelCase } from 'lodash';
import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { findSourceWord } from '../../../common/documens/find-source-word';
import { getBindablesCompletion } from '../../../feature/completions/completions';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { getVirtualDefinition } from '../../../feature/definition/virtualDefinition';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';
import { UriUtils } from '../../../common/view/uri-utils';

export class CustomElementLanguageService
  implements AbstractRegionLanguageService
{
  public async doComplete(
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

  public async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    customElementRegion: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    document.getText(); /* ? */
    const offset = document.offsetAt(position);
    const goToSourceWord = findSourceWord(customElementRegion, offset);

    const aureliaSourceFiles = aureliaProgram.getAureliaSourceFiles();
    const targetAureliaFile = aureliaSourceFiles?.find((sourceFile) => {
      return path.parse(sourceFile.fileName).name === goToSourceWord;
    });

    /**
     * 1. Triggered on <|my-component>
     */
    if (typeof targetAureliaFile?.fileName === 'string') {
      return {
        lineAndCharacter: {
          line: 1,
          character: 1,
        } /** TODO: Find class declaration position. Currently default to top of file */,
        viewModelFilePath: UriUtils.toSysPath(targetAureliaFile?.fileName),
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
      UriUtils.toSysPath(targetAureliaFileDifferentViewModel.fileName),
      aureliaProgram,
      sourceWordCamelCase
    );

    return;
  }
}
