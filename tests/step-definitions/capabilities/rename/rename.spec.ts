import { StepDefinitions } from 'jest-cucumber';
import { WorkspaceEdit } from 'vscode-languageserver';
import { Logger } from '../../../../server/src/common/logging/logger';
import { position } from '../common/common-capabilities.spec';
import { languageModes } from '../new-common/file.step';
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
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    // TODO: update componentList
  });

  and(
    'all other components, that also use the Bindable should be renamed',
    () => {
      expect(renamed?.changes).toBeDefined();
      if (renamed?.changes) {
        expect(Object.keys(renamed.changes).length).toBeGreaterThan(0);
      }
    }
  );
};
