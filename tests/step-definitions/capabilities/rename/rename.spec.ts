import { StepDefinitions } from 'jest-cucumber';
import { WorkspaceEdit } from 'vscode-languageserver';

import { Logger } from '../../../../server/src/common/logging/logger';
import { languageModes, position } from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('rename.spec');

let renamed: WorkspaceEdit | undefined;

export const renameSteps: StepDefinitions = ({ given, and, when, then }) => {
  when(/^I trigger Rename to (.*)$/, async (newWord: string) => {
    /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf:true});

    const document = myMockServer.textDocuments.getFirst();

    renamed = await myMockServer
      .getAureliaServer()
      .onRenameRequest(position, document, newWord, languageModes);
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

  and(
    'all other components, that also use the Bindable should be renamed',
    () => {
      expect(renamed?.changes).toBeDefined();
      if (renamed?.changes) {
        expect(Object.keys(renamed.changes).length).toBeGreaterThan(5);
      }

      // expect(true).toBeFalsy();
    }
  );
};
