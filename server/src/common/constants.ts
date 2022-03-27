import { InsertTextFormat } from 'vscode-languageserver';
import { CompletionItemKind, MarkupKind } from 'vscode-languageserver-types';

export const CUSTOM_ELEMENT_SUFFIX = 'CustomElement';
export const VALUE_CONVERTER_SUFFIX = 'ValueConverter';

export const TEMPLATE_TAG_NAME = 'template';

export const VIRTUAL_SOURCE_FILENAME = 'virtual.ts';

export const AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER = ' ';
export enum TemplateAttributeTriggers {
  SPACE = ' ',
  DOT = '.',
}

export enum AureliaVersion {
  V1 = 'V1',
  V2 = 'V2',
  ALL = 'ALL',
}

export const AURELIA_ATTRIBUTE_WITH_BIND_KEYWORD = [
  'accesskey',
  'class',
  'contenteditable',
  'contextmenu',
  'data-*',
  'dir',
  'id',
  'lang',
  'slot',
  'style',
  'tabindex',
  'title',
  'translate',
  'innerhtml',
  'textcontent',
];

export const AURELIA_ATTRIBUTE_WITH_TRIGGER_KEYWORD = [
  'blur',
  'focus',
  'load',
  'unload',
];

export const AURELIA_ATTRIBUTE_WITH_DELEGATE_KEYWORD = [
  'cached',
  'error',
  'abort',
  'beforeunload',
  'online',
  'offline',
  'animationstart',
  'animationend',
  'animationiteration',
  'reset',
  'compositionstart',
  'compositionupdate',
  'compositionend',
  'cut',
  'copy',
  'paste',
  'keydown',
  'keyup',
  'mouseenter',
  'mouseover',
  'mousemove',
  'mousedown',
  'mouseup',
  'click',
  'dblclick',
  'contextmenu',
  'wheel',
  'mouseleave',
  'mouseout',
  'select',
  'dragstart',
  'drag',
  'dragend',
  'dragenter',
  'dragover',
  'dragleave',
  'drop',
  'touchcancel',
  'touchend',
  'touchmove',
  'touchstart',
  'pointerover',
  'pointerenter',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointercancel',
  'pointerout',
  'pointerleave',
  'gotpointercapture',
  'lostpointercapture',
];
export const AURELIA_BINDABLE_KEYWORDS = [
  'if',
  'promise',
  'then',
  'catch',
  'show',
  'switch',
];
export const AURELIA_WITH_SPECIAL_KEYWORD = [
  ['repeat.for', '="$1 of $0"'],
  ['element.ref', '="$0"'],
  ['view-model.ref', '="$0"'],
  ['view.ref', '="$0"'],
  ['controller.ref', '="$0"'],
  ['show.bind', '="$0"'],
  ['if.bind', '="$0"'],
  ['with.bind', '="$0"'],
  ['as-element', '="$0"'],
  ['ref', '="$0"'],
  ['view-spy', '="$0"'],
  ['compile-spy', '="$0"'],
  ['else', ''],
];

export const AURELIA_WITH_SPECIAL_KEYWORD_V2 = [
  ['switch.bind', '="$0"'],
  ['case', '="$0"'],
  ['default-case', '="$0"'],
  ['promise.bind', '="$0"'],
  ['pending', '="$0"'],
  ['then.from-view', '="$0"'],
  ['catch.from-view', '="$0"'],
  ['portal', '="$0"'],
  ['property', '="$0"'], // local templates
];

export const AURELIA_COMPLETION_ITEMS_V2 = [
  {
    data: AureliaVersion.V2,
    detail: 'Aurelia As Custom Element',
    label: '(Au2) as-custom-element',
    kind: CompletionItemKind.Property,
    insertText: 'as-custom-element="${0:elementName}"',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Makes a tag inerit the view model of the as custom element.',
    },
  },
];

export const AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER = '.';
export const AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST = [
  'bind',
  'to-view',
  'from-view',
  'two-way',
  'one-time',
  'call',
  'delegate',
  'trigger',
] as const;

export enum AureliaClassTypes {
  CUSTOM_ELEMENT = 'CustomElement',
  VALUE_CONVERTER = 'ValueConverter',
}

export enum AureliaViewModel {
  TO_VIEW = 'toView',
  TEMPLATE = 'template',
}

export enum AureliaView {
  BINDABLE = 'bindable',
  IF = 'if',
  IMPORT = 'import',
  IMPORT_FROM_ATTRIBUTE = 'from',
  TEMPLATE_TAG_NAME = 'template',
  REPEAT_FOR = 'repeat.for',
  REQUIRE = 'require',
  VALUE_CONVERTER_OPERATOR = '|',
  VALUE_CONVERTER_ARGUMENT = ':',
}

export enum AureliaDecorator {
  CUSTOM_ELEMENT = '@customElement',
  VALUE_CONVERTER = '@valueConverter',
  USE_VIEW = '@useView',
  NO_VIEW = '@noView',
}

export enum AureliaLSP {
  /** [c]ompletion [i]tem [d]ata [t]ype -> cidt */
  AureliaCompletionItemDataType = 'AURELIA_CIDT',
}

export const WORD_SEPARATORS = '`~!@#%^&*()=+[{]}|;:\'",.<>/?'; // removed -,$
export const WORD_SEPARATORS_REGEX_STRING =
  '\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\|\\;\\:\'\\"\\,\\.\\<\\>\\/\\?';
export const whiteSpaceRegex = /[\s\r\n\t]/;

export const interpolationRegex = /\$(?:\s*)\{(?!\s*`)(.*?)\}/g;

export const EXTENSION_COMMAND_PREFIX = 'extension.au';
export const AURELIA_COMMANDS = [
  'extension.au.fix.add.missing.import',
  'extension.au.refactor.aTag',
  'extension.au.reloadExtension',
  'extension.au.runDiagnosticsForCurrentFile',
] as const;
export type AURELIA_COMMANDS_KEYS = typeof AURELIA_COMMANDS[number];

export const CLIENT_COMMANDS = ['client.get.active.file'] as const;
export type CLIENT_COMMANDS_KEYS = typeof CLIENT_COMMANDS[number];

interface CodeActionCommand {
  command: string;
  title: string;
  newTagName?: string;
  newText?: string;
  newAttribute?: string;
}

type CodeActionMap = Record<string, CodeActionCommand>;

export const CodeActionMap = {
  'refactor.aTag': {
    command: 'extension.au.refactor.aTag',
    title: 'Au: Convert to import tag 🟪',
    newText: 'import',
    newAttribute: 'from',
  },
  'fix.add.missing.import': {
    command: 'extension.au.fix.add.missing.import',
    title: 'Au: Add missing import 🟪',
    newTagName: '',
    newText: '',
    newAttribute: '',
  },
} as const;
