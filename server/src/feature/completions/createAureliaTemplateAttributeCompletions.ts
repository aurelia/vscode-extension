import { CompletionItem, InsertTextFormat } from 'vscode-languageserver';

import {
  AURELIA_ATTRIBUTE_WITH_BIND_KEYWORD,
  AURELIA_ATTRIBUTE_WITH_DELEGATE_KEYWORD,
  AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST,
  AURELIA_WITH_SPECIAL_KEYWORD,
} from '../../common/constants';

export function createAureliaTemplateAttributeKeywordCompletions(
  nextChar: string
): CompletionItem[] {
  const result = AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST.map((keyword) => {
    const completionItem = CompletionItem.create(keyword);
    const suffix = nextChar === '=' ? '' : '="$0"';
    const insertText = `${keyword}${suffix}`;
    // const insertText = `\${1|${keyword},bind,two-way,from-view,to-view,one-time|}${suffix}`;
    completionItem.insertText = insertText;
    completionItem.insertTextFormat = InsertTextFormat.Snippet;

    return completionItem;
  });

  return result;
}

export function createAureliaTemplateAttributeCompletions(): CompletionItem[] {
  const keywords = AURELIA_WITH_SPECIAL_KEYWORD.map(([keyword, suffix]) => {
    const completionItem = CompletionItem.create(keyword);
    const insertText = `${keyword}${suffix}`;
    completionItem.insertText = insertText;
    completionItem.insertTextFormat = InsertTextFormat.Snippet;
    completionItem.label = keyword;

    return completionItem;
  });

  const events = AURELIA_ATTRIBUTE_WITH_DELEGATE_KEYWORD.map((attribute) => {
    const completionItem = CompletionItem.create(attribute);
    const insertText = `${attribute}.delegate="$0"`;
    // const insertText = `${attribute}.\${1|delegate,trigger|}="$0"`;
    completionItem.insertText = insertText;
    completionItem.insertTextFormat = InsertTextFormat.Snippet;
    completionItem.label = `${attribute}.delegate`;

    return completionItem;
  });

  const attributesWithBind = AURELIA_ATTRIBUTE_WITH_BIND_KEYWORD.map(
    (attributeWithBind) => {
      const completionItem = CompletionItem.create(attributeWithBind);
      const insertText = `${attributeWithBind}.bind="$0"`;
      // const insertText = `${attributeWithBind}.\${1|bind,two-way,from-view,to-view,one-time|}="$0"`;
      completionItem.insertText = insertText;
      completionItem.insertTextFormat = InsertTextFormat.Snippet;
      completionItem.label = `${attributeWithBind}.bind`;

      return completionItem;
    }
  );

  const result = [...keywords, ...events, ...attributesWithBind];
  return result;
}
