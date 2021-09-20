import { TextDocumentPositionParams } from 'vscode-languageserver';

import { LanguageMode, TextDocument } from '../languageModes';
import { AureliaClassTypes } from '../../../common/constants';
import { createComponentCompletionList } from '../../completions/completions';
import { ViewRegionInfo } from '../embeddedSupport';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../../../viewModel/AureliaProgram';

export function getAureliaHtmlMode(): LanguageMode {
  return {
    getId() {
      return 'html';
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter: string | undefined,
      region?: ViewRegionInfo,
      aureliaProgram: AureliaProgram = importedAureliaProgram
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
