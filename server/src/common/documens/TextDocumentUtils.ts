import * as fs from 'fs';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { UriUtils } from '../view/uri-utils';

export class TextDocumentUtils {
  static createFromPath(
    path: string,
    languageId: 'html' | 'typescript' | 'javascript' = 'html'
  ): TextDocument {
    const content = fs.readFileSync(path, 'utf-8');
    const document = TextDocument.create(
      UriUtils.toUri(path),
      languageId,
      0,
      content
    );

    return document;
  }

  static createHtmlFromPath(path: string): TextDocument {
    const content = fs.readFileSync(path, 'utf-8');
    const document = TextDocument.create(
      UriUtils.toUri(path),
      'html',
      0,
      content
    );

    return document;
  }
}
