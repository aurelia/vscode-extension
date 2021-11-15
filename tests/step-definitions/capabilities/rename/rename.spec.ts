import { StepDefinitions } from 'jest-cucumber';
import { WorkspaceEdit } from 'vscode-languageserver';

import { Logger } from '../../../../server/src/common/logging/logger';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { position } from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('rename.spec');

let renamed: WorkspaceEdit | undefined;

export const renameSteps: StepDefinitions = ({ and, when, then }) => {
  when(/^I trigger Rename to (.*)$/, async (newWord: string) => {
    /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf:true});

    const document = myMockServer.textDocuments.getActive();

    renamed = await myMockServer
      .getAureliaServer()
      .onRenameRequest(document, position, newWord);
  });

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

  then('the word should be renamed', () => {
    expect(renamed?.changes).toBeDefined();
    if (renamed?.changes) {
      expect(Object.keys(renamed.changes).length).toBe(1);
    }
  });

  and(/^all other components (.*)$/, (numOtherComponents: string) => {
    expect(renamed?.changes).toBeDefined();
    // renamed; /*?*/
    if (renamed?.changes) {
      expect(Object.keys(renamed.changes).length).toBe(
        Number(numOtherComponents)
      );

      // TODO: Expect kebab case
      const targetChanges = Object.entries(renamed.changes).filter(
        ([fileName]) => fileName.endsWith('.html')
      );

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
      change; /* ? */

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
  const finalTargetPath = filePathOrFragment ?? UriUtils.toPath(uri ?? '');
  if (!finalTargetPath) return;
  if (!renamed?.changes) return;

  const [, targetChanges] =
    Object.entries(renamed?.changes).find(([fileUri]) => {
      const result = UriUtils.toPath(fileUri).includes(finalTargetPath);
      return result;
    }) ?? [];

  if (!targetChanges) return;

  return targetChanges;
}
