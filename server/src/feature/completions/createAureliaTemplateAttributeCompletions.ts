import { CompletionItem, InsertTextFormat } from 'vscode-languageserver';

import {
  AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST,
  AURELIA_WITH_SPECIAL_KEYWORD,
} from '../../common/constants';

export function createAureliaTemplateAttributeKeywordCompletions(): CompletionItem[] {
  const result = AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST.map((keyword) => {
    const completionItem = CompletionItem.create(keyword);
    const insertText = `${keyword}="$0"`;
    completionItem.insertText = insertText;
    completionItem.insertTextFormat = InsertTextFormat.Snippet;

    return completionItem;
  });

  return result;
}

export function createAureliaTemplateAttributeCompletions(): CompletionItem[] {
  const result = AURELIA_WITH_SPECIAL_KEYWORD.map(([keyword, binding]) => {
    const completionItem = CompletionItem.create(keyword);
    const insertText = `${keyword}${binding}`;
    completionItem.insertText = insertText;
    completionItem.insertTextFormat = InsertTextFormat.Snippet;

    return completionItem;
  });

  return result;
}
