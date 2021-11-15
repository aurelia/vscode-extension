import { StepDefinitions } from 'jest-cucumber';
import { Range } from 'vscode-languageserver-types';

import { Logger } from '../../../../server/src/common/logging/logger';
import { position } from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('codeAction.spec');

let codeActions: any | undefined;

export const codeActionSteps: StepDefinitions = ({ and, when, then }) => {
  when(/^I trigger Code Action (.*)$/, async (codeAction: string) => {
    codeAction; /* ? */

    const document = myMockServer.textDocuments.getActive();
    const range = Range.create(position, position);

    codeActions = await myMockServer.getAureliaServer().onCodeAction({
      textDocument: document,
      range,
      context: { diagnostics: [] },
    });
  });

  then(
    /^the correct Code Action should have been performed (.*)$/,
    (newCode: string) => {
      newCode; /* ? */
      codeActions;/* ? */
      expect(true).toBeFalsy();
    }
  );
};
