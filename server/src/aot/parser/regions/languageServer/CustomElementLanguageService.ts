import { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { findSourceWord } from '../../../../common/documens/find-source-word';
import { UriUtils } from '../../../../common/view/uri-utils';
import { getBindablesCompletion } from '../../../../feature/completions/completions';
import { AureliaProgram } from '../../../AureliaProgram';
import { DefinitionResult } from '../../parser-types';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class CustomElementLanguageService
  implements AbstractRegionLanguageService
{
  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter: string | undefined,
    region?: AbstractRegion
  ) {
    if (triggerCharacter === ' ') {
      const bindablesCompletion = await getBindablesCompletion(
        aureliaProgram,
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
    const offset = document.offsetAt(position);
    const goToSourceWord = findSourceWord(customElementRegion, offset);

    const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
      'componentName',
      goToSourceWord
    );
    if (targetComponent == null) return;

    /**
     * 1. Triggered on <|my-component>
     */
    return {
      lineAndCharacter: {
        line: 1,
        character: 1,
      } /** TODO: Find class declaration position. Currently default to top of file */,
      viewModelFilePath: UriUtils.toSysPath(targetComponent.viewModelFilePath),
    };
  }
}
