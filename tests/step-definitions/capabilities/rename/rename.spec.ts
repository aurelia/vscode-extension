import { StepDefinitions } from 'jest-cucumber';
import { WorkspaceEdit } from 'vscode-languageserver';

import { Logger } from '../../../../server/src/common/logging/logger';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { testError } from '../../../common/errors/TestErrors';
import { getPathsFromFileNames } from '../../../common/file-path-mocks';
import { position } from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('rename.spec');

let renamed: WorkspaceEdit | undefined;

export const renameSteps: StepDefinitions = ({ and, when, then }) => {
  when(/^I trigger Rename to (.*)$/, async (newWord: string) => {
    /* prettier-ignore */ logger.log('I trigger Suggestions',{env:'test'});

    const document = myMockServer.textDocuments.getActive();

    renamed = await myMockServer
      .getAureliaServer()
      .onRenameRequest(document, position, newWord);
  });

  when(
    /^I trigger Rename in the file "(.*)" to "(.*)"$/,
    async (fileName: string, newWord: string) => {
      /* prettier-ignore */ logger.log('I trigger Suggestions',{env:'test'});
      const uri = myMockServer.getWorkspaceUri();
      testError.verifyFileInProject(uri, fileName);
      const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
      const document = myMockServer.textDocuments
        .setActive(textDocumentPaths)
        .getActive();

      renamed = await myMockServer
        .getAureliaServer()
        .onRenameRequest(document, position, newWord);
    }
  );

  then('the View model variable should be renamed', () => {
    expect(renamed?.changes).toBeDefined();
    if (renamed?.changes) {
      const viewModelChanges = Object.keys(renamed.changes).some(
        (filePaths) => {
          const result = filePaths.includes('custom-element.ts');
          return result;
        }
      );
      expect(viewModelChanges).toBe(true);
    }
  });

  then(
    /^the View model variable in "(.*)" should be renamed$/,
    (fileName: string) => {
      expect(renamed?.changes).toBeDefined();
      if (renamed?.changes) {
        const targetChanges = Object.entries(renamed.changes).filter(([path]) => {
          return path.includes(fileName);
        });
        const [, changes] = targetChanges[0];

        expect(changes[0].range.start.line).toBe(1);
        expect(changes[0].range.end.line).toBe(1);
        expect(changes[1].range.start.line).toBe(15);
        expect(changes[1].range.end.line).toBe(15);
      }
    }
  );

  then('the word should be renamed', () => {
    expect(renamed?.changes).toBeDefined();
    if (renamed?.changes) {
      expect(Object.keys(renamed.changes).length).toBe(1);
    }
  });

  and(/^all other components (.*)$/, (numOtherComponents: string) => {
    expect(renamed?.changes).toBeDefined();
    if (renamed?.changes) {
      expect(Object.keys(renamed.changes).length).toBe(
        Number(numOtherComponents)
      );

      // TODO: Expect kebab case
      const targetChanges = Object.entries(renamed.changes).filter(
        ([fileName]) => fileName.endsWith('.html')
      );

      expect(targetChanges.length).toBeGreaterThan(0);

      if (!targetChanges.length) return;
      targetChanges.forEach(([fileName, change]) => {
        // same component
        if (fileName.includes('custom-element.html')) {
          expect(change[0].newText).toBe('newNew');
          // other components
        } else {
          expect(change[0].newText).toBe('new-new');
        }
      });
    }
  });

  then('the View model class should be renamed', () => {
    expect(renamed?.changes).toBeDefined();
    if (renamed?.changes) {
      const change = getRenameChangeFromFilePath({
        uri: myMockServer.textDocuments.getActive().uri,
      });
      // change; /*?*/
      expect(change).toBeDefined();
      if (!change) return;

      // TODO: Decorator
      expect(change.length).toBeGreaterThan(1);

      expect(change[0].range.start.character).toBe(24);
      expect(change[0].range.start.line).toBe(0);
      expect(change[0].range.end.character).toBe(38);
      expect(change[0].range.end.line).toBe(0);

      // Class identifier
      expect(change[1].range.start.character).toBe(13);
      expect(change[1].range.start.line).toBe(1);
      expect(change[1].range.end.character).toBe(39);
      expect(change[1].range.end.line).toBe(1);

      // expect(true).toBeFalsy();
    }
  });

  and(
    'all other components, that also use the Custom Element should be renamed',
    () => {
      const change = getRenameChangeFromFilePath({
        filePathOrFragment: 'other-custom-element-user.html',
      });

      if (!change) return;

      expect(change.length).toBeGreaterThan(1);

      // start tag
      expect(change[0].range.start.character).toBe(3);
      expect(change[0].range.start.line).toBe(5);
      expect(change[0].range.end.character).toBe(17);
      expect(change[0].range.end.line).toBe(5);

      // end tag
      expect(change[1].range.start.character).toBe(5);
      expect(change[1].range.start.line).toBe(10);
      expect(change[1].range.end.character).toBe(19);
      expect(change[1].range.end.line).toBe(10);
      // expect(true).toBeFalsy();
    }
  );

  and(
    /^only the Access scope should be renamed (.*) (.*)$/,
    (scopeStart: string, scopeEnd: string) => {
      const change = getRenameChangeFromFilePath({
        filePathOrFragment: 'custom-element.html',
      });

      expect(change).toBeDefined();
      if (change === undefined) return;
      expect(change[0].range.start.character).toBe(Number(scopeStart));
      expect(change[0].range.end.character).toBe(Number(scopeEnd));
    }
  );
};

function getRenameChangeFromFilePath({
  uri,
  filePathOrFragment,
}: {
  uri?: string;
  filePathOrFragment?: string;
}) {
  const finalTargetPath = filePathOrFragment ?? UriUtils.toSysPath(uri ?? '');
  if (!finalTargetPath) return;
  if (!renamed?.changes) return;

  const [, targetChanges] =
    Object.entries(renamed?.changes).find(([fileUri]) => {
      const result = UriUtils.toSysPath(fileUri).includes(finalTargetPath);
      return result;
    }) ?? [];

  if (!targetChanges) return;

  return targetChanges;
}
