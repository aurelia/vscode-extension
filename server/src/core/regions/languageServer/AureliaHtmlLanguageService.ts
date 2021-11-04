import { TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaClassTypes } from '../../../common/constants';
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
    if (triggerCharacter === '<') {
      const aureliaComponents = aureliaProgram.aureliaComponents
        .getAll()
        .filter(
          (component) => component.type === AureliaClassTypes.CUSTOM_ELEMENT
        );
      const componentCompletions =
        createComponentCompletionList(aureliaComponents);

      return componentCompletions;
    }
    return [];
  }
}
