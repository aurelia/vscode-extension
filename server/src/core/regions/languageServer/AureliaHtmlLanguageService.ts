import { getLanguageService } from 'vscode-html-languageservice';
import {
  CodeAction,
  Command,
  Range,
  TextDocumentPositionParams,
} from 'vscode-languageserver';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';
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

  public async doCodeAction(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    startPosition: Position
  ) {
    const htmlLanguageService = getLanguageService();
    // const result = htmlLanguageService.createScanner('input');
    // result.scan();

    // <<<< Try out the scanner ^

    const htmlDocument = htmlLanguageService.parseHTMLDocument(document);
    const offset = document.offsetAt(startPosition);
    const targetNode = htmlDocument.findNodeAt(offset);
    const startTagPosition = document.positionAt(targetNode.start);
    const endTagPosition = document.positionAt(targetNode.end);
    const range = Range.create(startTagPosition, endTagPosition);

    const kind = 'extension.au.refactor.aTag';
    const command = Command.create('Au: Command <<', kind, ['test-arg']);
    const codeAcion = CodeAction.create('Au: Convert to import', command, kind);
    codeAcion.edit = {
      changes: {
        [document.uri]: [{ newText: 'hello', range }],
      },
    };
    return [codeAcion];
  }
}
