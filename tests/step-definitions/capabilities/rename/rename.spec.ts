import { loadFeature, defineFeature } from 'jest-cucumber';
import { WorkspaceEdit } from 'vscode-languageserver';
import { Position } from 'vscode-languageserver-protocol';
import { AsyncReturnType } from '../../../../server/src/common/global';
import { Logger } from '../../../../server/src/common/logging/logger';
import {
  AureliaCompletionItem,
  isAureliaCompletionItem,
} from '../../../../server/src/feature/completions/virtualCompletion';
import {
  CompletionList,
  createTextDocumentPositionParams,
  getLanguageModes,
} from '../../../../server/src/feature/embeddedLanguages/languageModes';
import { getPathsFromFileNames } from '../../../common/file-path-mocks';
import { getTestDir } from '../../../common/files/get-test-dir';
import { FixtureNames } from '../../../common/fixtures/get-fixture-dir';
import { completions } from '../completions.spec';
import {
  removeCursorFromCode,
  givenImOnTheLineAtCharacter,
} from '../new-common/file.step';
import {
  givenIOpenVsCodeWithTheFollowingFiles,
  myMockServer,
  theProjectIsNamed,
} from '../new-common/project.step';

const logger = new Logger('rename.spec');

const feature = loadFeature(
  `${getTestDir()}/features/capabilities/rename/rename.feature`
);

defineFeature(feature, (test) => {
  let code = '';
  let languageModes: AsyncReturnType<typeof getLanguageModes>;
  let position: Position;
  let renamed: WorkspaceEdit | undefined;

  test('Rename', ({ given, when, then, and }) => {
    given(
      /^the project is named "(.*)"$/,
      async (projectName: FixtureNames) => {
        /* prettier-ignore */ theProjectIsNamed(projectName);
      }
    );

    and(
      /^I open VSCode with the following file "(.*)"$/,
      async (fileName: string) => {
        /* prettier-ignore */ logger.log('^I open VSCode with the following file "(.*)"$');
        const uri = myMockServer.getWorkspaceUri();
        const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
        await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
      }
    );

    and(
      /^I'm on the line (\d+) at character (.*)$/,
      async (line: number, codeWithCursor: string) => {
        /* prettier-ignore */ logger.log('/^I\'m on the line (\d+) at character (.*)$/',{logPerf: true});

        code = removeCursorFromCode(codeWithCursor);

        ({ position, languageModes } = await givenImOnTheLineAtCharacter(
          codeWithCursor,
          Number(line)
        ));
      }
    );

    when('I trigger rename', async () => {
      /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf:true});

      const document = myMockServer.textDocuments.getFirst();

      renamed = await myMockServer
        .getAureliaServer()
        .onRenameRequest(position, document, 'new', languageModes);
      // /* prettier-ignore */ console.log('TCL: renamed', renamed)
      JSON.stringify(renamed, null, 4); /*?*/

      expect(true).toBeFalsy();
    });
  });
});
