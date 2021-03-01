import { TextDocumentPositionParams } from 'vscode-languageserver';

import { LanguageMode, TextDocument } from '../languageModes';
import { aureliaProgram } from '../../../viewModel/AureliaProgram';
import { AureliaClassTypes } from '../../../common/constants';
import { createComponentCompletionList } from '../../completions/completions';

export function getAureliaHtmlMode(): LanguageMode {
  return {
    getId() {
      return 'html';
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter: string | undefined
    ) {
      if (triggerCharacter === '<') {
        const aureliaComponents = aureliaProgram
          .getComponentList()
          .filter(
            (component) => component.type === AureliaClassTypes.CUSTOM_ELEMENT
          );
        const componentCompletions = createComponentCompletionList(
          aureliaComponents
        );

        return componentCompletions;
      }
      return [];
    },
    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
