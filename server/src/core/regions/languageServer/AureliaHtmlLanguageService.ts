import { getLanguageService } from 'vscode-html-languageservice';
import {
  CodeAction,
  Command,
  Position,
  Range,
  TextDocumentPositionParams,
  TextEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem } from 'vscode-languageserver-types';

import { AureliaClassTypes, CodeActionMap } from '../../../common/constants';
import { PositionUtils } from '../../../common/documens/PositionUtils';
import { Logger } from '../../../common/logging/logger';
import { ParseHtml } from '../../../common/view/document-parsing';
import { AURELIA_KEY_WORD_COMPLETIONS } from '../../../feature/completions/aureliaKeyWordCompletions';
import { createComponentCompletionList } from '../../../feature/completions/completions';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

const logger = new Logger('AuHtmlLS');

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
    const htmlDocument = htmlLanguageService.parseHTMLDocument(document);

    // ---- refactor.aTag ----
    // Get tag range
    // Rename a tag
    const renameTag = htmlLanguageService.doRename(
      document,
      startPosition,
      CodeActionMap['refactor.aTag'].newText,
      htmlDocument
    );
    // Rename href attribute
    const offset = document.offsetAt(startPosition);
    const targetTag = ParseHtml.findTagAtOffset(document.getText(), offset);
    const hrefAttribute = targetTag?.sourceCodeLocation?.attrs['href'];
    /* prettier-ignore */ if (hrefAttribute === undefined) { logger.log('href attribute not found'); return []; }

    const { startLine, startCol, endLine, endCol } = hrefAttribute;
    const hrefStartPosition = PositionUtils.convertToZeroIndexed(
      startLine,
      startCol
    );
    const hrefEndPosition = PositionUtils.convertToZeroIndexed(endLine, endCol);
    const range = Range.create(hrefStartPosition, hrefEndPosition);
    const hrefEdit = TextEdit.replace(
      range,
      CodeActionMap['refactor.aTag'].newAttribute
    );

    // Create code action
    const kind = CodeActionMap['refactor.aTag'].command;
    const command = Command.create('Au: Command <<', kind, ['test-arg']);
    const codeAcion = CodeAction.create(
      CodeActionMap['refactor.aTag'].title,
      command,
      kind
    );

    if (renameTag?.changes == null) return [];
    codeAcion.edit = {
      changes: {
        [document.uri]: [...renameTag.changes[document.uri], hrefEdit],
      },
    };
    return [codeAcion];
  }
}
