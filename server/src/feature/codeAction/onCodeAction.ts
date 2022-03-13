import { TextDocuments } from 'vscode-languageserver';
import { CodeActionParams } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AbstractRegionLanguageService } from '../../aot/parser/regions/languageServer/AbstractRegionLanguageService';
import { AureliaHtmlLanguageService } from '../../aot/parser/regions/languageServer/AureliaHtmlLanguageService';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { RegionService } from '../../common/services/RegionService';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';

export async function onCodeAction(
  container: Container,
  { textDocument, range }: CodeActionParams,
  allDocuments: TextDocuments<TextDocument>
) {
  // We need some kind of code action map
  // Since, eg. the aHref tag should only trigger "rename to import tag" code action

  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(textDocument.uri);
  if (!targetProject) return [];
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return [];

  const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
    'viewFilePath',
    UriUtils.toSysPath(textDocument.uri)
  );
  const regions = targetComponent?.viewRegions;
  if (!regions) return [];

  const region = RegionService.findRegionAtPosition(regions, range.start);

  let languageService: AbstractRegionLanguageService;
  if (region === undefined) {
    languageService = new AureliaHtmlLanguageService();
  } else {
    languageService = region.languageService;
  }
  const doCodeAction = languageService.doCodeAction;

  if (doCodeAction) {
    const document = TextDocumentUtils.createHtmlFromUri(
      textDocument,
      allDocuments
    );
    const codeAction = await doCodeAction(
      aureliaProgram,
      document,
      range.start,
      region
    );
    return codeAction;
  }
}
