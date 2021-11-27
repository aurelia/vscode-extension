/* eslint-disable no-template-curly-in-string */
import {
  MarkupKind,
  InsertTextFormat,
  CompletionItemKind,
} from 'vscode-languageserver';
import { CompletionItem } from 'vscode-languageserver-types';

import { AureliaVersion } from '../../common/constants';

export const AURELIA_KEY_WORD_COMPLETIONS: CompletionItem[] = [
  {
    data: AureliaVersion.V1,
    detail: 'Require',
    insertText: '<require from="$1"></require>',
    insertTextFormat: InsertTextFormat.Snippet,
    kind: CompletionItemKind.Property,
    label: '(Au) require',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `Allows importing of references in HTML

      <require from="$1"></require>
      `,
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Import',
    insertText: '<import from="$1"></import>',
    insertTextFormat: InsertTextFormat.Snippet,
    kind: CompletionItemKind.Property,
    label: '(Au) import',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `Allows importing of references in HTML

      <import from="$1"></import>
      `,
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia As Custom Element',
    label: '(Au) as-custom-element',
    kind: CompletionItemKind.Property,
    insertText: 'as-custom-element="${elementName}"',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Makes a tag inerit the view model of the as custom element.',
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia Slot - Default',
    label: '(Au) au-slot (default)',
    kind: CompletionItemKind.Property,
    insertText: '<au-slot></au-slot>',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `

      <au-slot></au-slot>
      `,
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia Slot - Named',
    label: '(Au) au-slot (named)',
    kind: CompletionItemKind.Property,
    insertText: '<au-slot name="${name}"></au-slot>',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `

      <au-slot name="\${name}"></au-slot>
      `,
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia Viewport',
    label: '(Au) au-viewport',
    kind: CompletionItemKind.Property,
    insertText: '<au-viewport></au-viewport>',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `

      <au-viewport></au-viewport>
      `,
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia Viewport With Default',
    label: '(Au) au-viewport (default)',
    kind: CompletionItemKind.Property,
    insertText: '<au-viewport default="${name}"></au-viewport>',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `

      <au-viewport default="\${name}"></au-viewport>
      `,
    },
  },
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia Viewport With Default + Parameter',
    label: '(Au) au-viewport (default+params)',
    kind: CompletionItemKind.Property,
    insertText: '<au-viewport default="${name}(id=${id})"></au-viewport>',
    documentation: {
      kind: MarkupKind.Markdown,
      value: `Aurelia Viewport With Default + Parameter

      <au-viewport default="\${name}(id=\${id})"></au-viewport>
      `,
    },
  },
];
