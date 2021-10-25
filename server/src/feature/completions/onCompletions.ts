import {
  TextDocumentPositionParams,
  CompletionItem,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER,
  AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER,
} from '../../common/constants';
import { Logger } from '../../common/logging/logger';
import { checkInsideTag } from '../../common/view/document-parsing';
import { LanguageModes } from '../../core/embeddedLanguages/languageModes';
import {
  createAureliaTemplateAttributeKeywordCompletions,
  createAureliaTemplateAttributeCompletions,
} from './createAureliaTemplateAttributeCompletions';

const logger = new Logger('on-completions');

export async function onCompletion(
  _textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument,
  languageModes: LanguageModes
) {
  const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
    document,
    _textDocumentPosition.position
  );

  if (!modeAndRegion) return [];
  const { mode } = modeAndRegion;

  if (!mode) return [];

  const doComplete = mode.doComplete;
  const text = document.getText();
  const offset = document.offsetAt(_textDocumentPosition.position);
  const triggerCharacter = text.substring(offset - 1, offset);
  let accumulateCompletions: CompletionItem[] = [];

  if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER) {
    const isNotRegion = modeAndRegion.region === undefined;
    const isInsideTag = await checkInsideTag(document, offset);
    if (isNotRegion && isInsideTag) {
      const atakCompletions = createAureliaTemplateAttributeKeywordCompletions();
      return atakCompletions;
    }
  } else if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER) {
    let ataCompletions: CompletionItem[];
    const isNotRegion = modeAndRegion.region === undefined;
    const isInsideTag = await checkInsideTag(document, offset);

    if (isInsideTag) {
      ataCompletions = createAureliaTemplateAttributeCompletions();

      if (isNotRegion) {
        return ataCompletions;
      }

      accumulateCompletions = ataCompletions;
    }
  }

  if (doComplete !== undefined) {
    let completions: CompletionItem[] = [CompletionItem.create('')];
    try {
      completions = ((await doComplete(
        document,
        _textDocumentPosition,
        triggerCharacter,
        modeAndRegion.region
      )) as unknown) as CompletionItem[];
    } catch (error) {
      console.log('TCL: error', error);
    }

    accumulateCompletions.push(...completions);
    return accumulateCompletions;
  }

  return [];
}