import { TextDocumentPositionParams } from 'vscode-languageserver';

import { AureliaClassTypes } from '../../../common/constants';
import { createComponentCompletionList } from '../../../feature/completions/completions';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo } from '../embeddedSupport';
import { LanguageMode, TextDocument } from '../languageModes';

export function getAureliaHtmlMode(
  aureliaProgram: AureliaProgram
): LanguageMode {
  return {
    getId() {
      return 'html';
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter: string | undefined,
      region?: ViewRegionInfo
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
