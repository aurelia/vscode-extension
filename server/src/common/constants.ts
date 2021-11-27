export const CUSTOM_ELEMENT_SUFFIX = 'CustomElement';
export const VALUE_CONVERTER_SUFFIX = 'ValueConverter';

export const TEMPLATE_TAG_NAME = 'template';

export const VIRTUAL_SOURCE_FILENAME = 'virtual.ts';

export const AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER = ' ';
export const AURELIA_ATTRIBUTE_WITH_BIND_KEYWORD = [
  ['accesskey'],
  ['class'],
  ['contenteditable'],
  ['contextmenu'],
  ['data-*'],
  ['dir'],
  ['id'],
  ['lang'],
  ['slot'],
  ['style'],
  ['tabindex'],
  ['title'],
  ['translate'],
  ['innerhtml'],
  ['textcontent'],
];
export const AURELIA_ATTRIBUTE_WITH_DELEGATE_KEYWORD = [
  ['cached'],
  ['error'],
  ['abort'],
  ['load'],
  ['beforeunload'],
  ['unload'],
  ['online'],
  ['offline'],
  ['focus'],
  ['blur'],
  ['animationstart'],
  ['animationend'],
  ['animationiteration'],
  ['reset'],
  ['compositionstart'],
  ['compositionupdate'],
  ['compositionend'],
  ['cut'],
  ['copy'],
  ['paste'],
  ['keydown'],
  ['keyup'],
  ['mouseenter'],
  ['mouseover'],
  ['mousemove'],
  ['mousedown'],
  ['mouseup'],
  ['click'],
  ['dblclick'],
  ['contextmenu'],
  ['wheel'],
  ['mouseleave'],
  ['mouseout'],
  ['select'],
  ['dragstart'],
  ['drag'],
  ['dragend'],
  ['dragenter'],
  ['dragover'],
  ['dragleave'],
  ['drop'],
  ['touchcancel'],
  ['touchend'],
  ['touchmove'],
  ['touchstart'],
  ['pointerover'],
  ['pointerenter'],
  ['pointerdown'],
  ['pointermove'],
  ['pointerup'],
  ['pointercancel'],
  ['pointerout'],
  ['pointerleave'],
  ['gotpointercapture'],
  ['lostpointercapture'],
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

export const AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER = '.';
export const AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST = [
  'bind',
  'to-view',
  'one-way',
  'from-view',
  'two-way',
  'one-time',
  'call',
  'delegate',
  'trigger',
] as const;

export enum AureliaVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export enum AureliaClassTypes {
  CUSTOM_ELEMENT = 'CustomElement',
  VALUE_CONVERTER = 'ValueConverter',
}

export enum AureliaViewModel {
  TO_VIEW = 'toView',
  TEMPLATE = 'template',
}

export enum AureliaView {
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

export const EXTENSION_COMMAND_PREFIX = 'extension.au';
export const AURELIA_COMMANDS = [
  'extension.au.refactor.aTag',
  'extension.au.reloadExtension',
] as const;
export type AURELIA_COMMANDS_KEYS = typeof AURELIA_COMMANDS[number];

export const CodeActionMap = {
  'refactor.aTag': {
    command: 'extension.au.refactor.aTag',
    title: 'Au: Convert to import tag 🟪',
    newText: 'import',
    newAttribute: 'from',
  },
};
