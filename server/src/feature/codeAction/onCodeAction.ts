import {
  CodeAction,
  CodeActionParams,
  Command,
  Position,
  Range,
} from 'vscode-languageserver-protocol';

import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { ViewRegionUtils } from '../../common/documens/ViewRegionUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { AbstractRegionLanguageService } from '../../core/regions/languageServer/AbstractRegionLanguageService';
import { AureliaHtmlLanguageService } from '../../core/regions/languageServer/AureliaHtmlLanguageService';

export async function onCodeAction(
  container: Container,
  { textDocument, range }: CodeActionParams
) {
  // We need some kind of code action map
  // Since, eg. the aHref tag should only trigger "rename to import tag" code action

  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(textDocument.uri);
  if (!targetProject) return;
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return;

  const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
    'viewFilePath',
    UriUtils.toPath(textDocument.uri)
  );
  const regions = targetComponent?.viewRegions;
  if (!regions) return;

  const region = ViewRegionUtils.findRegionAtPosition(regions, range.start);

  let languageService: AbstractRegionLanguageService;
  if (region === undefined) {
    languageService = new AureliaHtmlLanguageService();
  } else {
    languageService = region.languageService;
  }
  const doCodeAction = languageService.doCodeAction;

  if (doCodeAction) {
    const document = TextDocumentUtils.createHtmlFromUri(textDocument);
    const codeAction = await doCodeAction(
      aureliaProgram,
      document,
      range.start,
      region
    );
    return codeAction;
  }

  const kind = 'extension.au.refactor.component';
  const command = Command.create('Au: Command <<', kind, ['test-arg']);
  const codeAcion = CodeAction.create('Au: Create component', command, kind);
  const uri = UriUtils.toUri(
    '/home/hdn/coding/repos/vscode-extension/tests/testFixture/scoped-for-testing/src/view/custom-element/other-custom-element-user.html'
  );
  codeAcion.edit = {
    changes: {
      [uri]: [{ newText: 'hello', range }],
    },
  };
  return [codeAcion];
}
