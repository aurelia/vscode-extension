import * as fs from 'fs';

import { TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  DocumentSettings,
  ExtensionSettings,
} from '../../configuration/DocumentSettings';
import { UriUtils } from '../view/uri-utils';

export class TextDocumentUtils {
  public static createFromPath(
    path: string,
    languageId: 'html' | 'typescript' | 'javascript' = 'html'
  ): TextDocument {
    const content = fs.readFileSync(path, 'utf-8');
    const document = TextDocument.create(
      UriUtils.toVscodeUri(path),
      languageId,
      0,
      content
    );

    return document;
  }

  public static createHtmlFromUri(
    { uri }: { uri: string },
    allDocuments?: TextDocuments<TextDocument>
  ): TextDocument {
    const openDocument = allDocuments?.get(uri);
    if (openDocument) {
      return openDocument;
    }

    const content = fs.readFileSync(UriUtils.toSysPath(uri), 'utf-8');
    const document = TextDocument.create(uri, 'html', 0, content);

    return document;
  }

  public static createHtmlFromPath(path: string): TextDocument {
    const content = fs.readFileSync(path, 'utf-8');
    const document = TextDocument.create(
      UriUtils.toVscodeUri(path),
      'html',
      0,
      content
    );

    return document;
  }
}

export function isViewModelDocument(
  document: { uri: string },
  documentSettings: DocumentSettings | ExtensionSettings
) {
  let settings: ExtensionSettings;
  if (documentSettings instanceof DocumentSettings) {
    settings = documentSettings.getSettings();
  } else {
    settings = documentSettings;
  }

  const scriptExtensions = settings?.relatedFiles?.script;
  const isScript = scriptExtensions?.find((extension) =>
    document.uri.endsWith(extension)
  );
  return Boolean(isScript);
}
