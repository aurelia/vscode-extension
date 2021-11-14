import { TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem } from 'vscode-languageserver-types';

import { AureliaClassTypes } from '../../../common/constants';
import { AURELIA_KEY_WORD_COMPLETIONS } from '../../../feature/completions/aureliaKeyWordCompletions';
import { createComponentCompletionList } from '../../../feature/completions/completions';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class AureliaHtmlLanguageService
  implements AbstractRegionLanguageService
{
  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    _textDocumentPosition: TextDocumentPositionParams,
    triggerCharacter: string | undefined
  ) {
    const finalCompletions: CompletionItem[] = AURELIA_KEY_WORD_COMPLETIONS;

    if (triggerCharacter === '<') {
      const aureliaComponents = aureliaProgram.aureliaComponents
        .getAll()
        .filter(
          (component) => component.type === AureliaClassTypes.CUSTOM_ELEMENT
        );
      const componentCompletions =
        createComponentCompletionList(aureliaComponents);

      finalCompletions.push(...componentCompletions);
    }

    return finalCompletions;
  }
}
