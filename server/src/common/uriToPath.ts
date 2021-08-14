import { fileURLToPath } from 'url';
import * as path from 'path';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function uriToPath(documents: TextDocument[]) {
  const documentPaths = documents.map((document) => {
    const documentPath = fileURLToPath(path.normalize(document.uri));
    return documentPath;
  });

  return documentPaths;
}