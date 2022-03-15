import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionService } from '../../common/services/RegionService';
import { Container } from '../../core/container';

export function createDiagnostics(
  container: Container,
  document: TextDocument
): Diagnostic[] {
  const regions = RegionService.getRegionsInDocument(container, document);

  return [];
}
