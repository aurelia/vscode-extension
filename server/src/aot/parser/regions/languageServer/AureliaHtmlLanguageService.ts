import { getLanguageService } from 'vscode-html-languageservice';
import {
  CodeAction,
  Command,
  Position,
  Range,
  TextEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem } from 'vscode-languageserver-types';

import { AureliaClassTypes, CodeActionMap } from '../../../../common/constants';
import { PositionUtils } from '../../../../common/documens/PositionUtils';
import { ParseHtml } from '../../../../common/view/document-parsing';
import { AURELIA_KEY_WORD_COMPLETIONS } from '../../../../feature/completions/aureliaKeyWordCompletions';
import { createComponentCompletionList } from '../../../../feature/completions/completions';
import { AureliaProgram } from '../../../AureliaProgram';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class AureliaHtmlLanguageService
  implements AbstractRegionLanguageService
{
  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter: string | undefined
  ) {
    if (triggerCharacter === '<') {
      const finalCompletions: CompletionItem[] = [
        ...AURELIA_KEY_WORD_COMPLETIONS,
      ];

      const aureliaComponents = aureliaProgram.aureliaComponents
        .getAll()
        .filter(
          (component) => component.type === AureliaClassTypes.CUSTOM_ELEMENT
        );
      const componentCompletions =
        createComponentCompletionList(aureliaComponents);

      finalCompletions.push(...componentCompletions);
      return finalCompletions;
    }

    return [];
  }

  public async doCodeAction(
    document: TextDocument,
    startPosition: Position
  ) {
    const allCodeActions: CodeAction[] = [];
    // ---- refactor.aTag ----
    const aTagCodeAction = createCodeAction_RenameATag(document, startPosition);
    if (aTagCodeAction) {
      allCodeActions.push(aTagCodeAction);
    }

    return allCodeActions;
  }
}

function createCodeAction_RenameATag(
  document: TextDocument,
  position: Position
) {
  const htmlLanguageService = getLanguageService();
  const htmlDocument = htmlLanguageService.parseHTMLDocument(document);
  const offset = document.offsetAt(position);
  const aTag = ParseHtml.findTagAtOffset(document.getText(), offset);
  const HREF = 'href';

  // Early return, if not <a href> tag
  if (aTag?.tagName !== 'a') return;
  const hrefAttribute = aTag?.sourceCodeLocation?.attrs['href'];
  if (hrefAttribute == null) return;
  if (aTag.sourceCodeLocation?.startLine == null) return;
  if (aTag.sourceCodeLocation?.startCol == null) return;

  // Get tag range
  // Rename <a> tag
  const aTagPosition = PositionUtils.convertToZeroIndexed(
    aTag.sourceCodeLocation?.startLine,
    aTag.sourceCodeLocation?.startCol + 1 // right of "<"
  );
  const renameTag = htmlLanguageService.doRename(
    document,
    aTagPosition,
    CodeActionMap['refactor.aTag'].newText,
    htmlDocument
  );

  // Rename href attribute
  const { startLine, startCol, endLine } = hrefAttribute;
  const hrefStartPosition = PositionUtils.convertToZeroIndexed(
    startLine,
    startCol
  );
  const hrefEndPosition = PositionUtils.convertToZeroIndexed(
    endLine,
    startCol + HREF.length // just the attribute name (was also the ="..." part)
  );
  const range = Range.create(hrefStartPosition, hrefEndPosition);
  const hrefEdit = TextEdit.replace(
    range,
    CodeActionMap['refactor.aTag'].newAttribute
  );

  // Create code action
  const kind = CodeActionMap['refactor.aTag'].command;
  if (renameTag?.changes == null) return;
  const edit = {
    changes: {
      [document.uri]: [...renameTag.changes[document.uri], hrefEdit],
    },
  };
  const command = Command.create('Au: Command <<', kind, [edit]);
  const codeAcion = CodeAction.create(
    CodeActionMap['refactor.aTag'].title,
    command,
    kind
  );
  codeAcion.edit = edit;

  return codeAcion;
}
