import { TextDocuments } from 'vscode-languageserver';
import { CodeActionParams } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { AnalyzerService } from '../../common/services/AnalyzerService';
import { RegionService } from '../../common/services/RegionService';
import { Container } from '../../core/container';

export async function onCodeAction(
  container: Container,
  { textDocument, range }: CodeActionParams,
  allDocuments: TextDocuments<TextDocument>
) {
  // We need some kind of code action map
  // Since, eg. the aHref tag should only trigger "rename to import tag" code action

  const targetComponent = container
    .get(AnalyzerService)
    .getComponentByDocumennt(textDocument);
  const regions = targetComponent?.viewRegions;
  if (!regions) return [];

  const region = RegionService.findRegionAtPosition(regions, range.start);
  const doCodeAction = region.languageService.doCodeAction;

  if (doCodeAction) {
    const document = TextDocumentUtils.getOrCreateHtmlFromUri(
      textDocument,
      allDocuments
    );
    const codeAction = await doCodeAction(
      container,
      document,
      range.start,
      region
    );
    return codeAction;
  }
}
