import { StepDefinitions } from 'jest-cucumber';
import { CodeAction, Range } from 'vscode-languageserver-types';

import { EXTENSION_COMMAND_PREFIX } from '../../../../server/src/common/constants';
import { Logger } from '../../../../server/src/common/logging/logger';
import { position } from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('codeAction.spec');

let codeActions: CodeAction[] | undefined = [];
let finalKind: string = '';

export const codeActionSteps: StepDefinitions = ({ when, then }) => {
  when(/^I trigger Code Action (.*)$/, async (codeAction: string) => {
    finalKind = `${EXTENSION_COMMAND_PREFIX}.${codeAction}`;

    const document = myMockServer.textDocuments.getActive();
    const range = Range.create(position, position);

    codeActions = await myMockServer.getAureliaServer().onCodeAction({
      textDocument: document,
      range,
      context: { diagnostics: [] },
    });
  });

  then(
    /^the the refactor Code Action should have been performed (.*)$/,
    (newCode: string) => {
      expect(codeActions).toBeDefined();
      if (codeActions === undefined) return;

      const targetCodeAction = codeActions.find(
        (codeAction) => codeAction.kind === finalKind
      );
      expect(targetCodeAction).toBeDefined();
      if (targetCodeAction?.edit?.changes == null) return;

      const document = myMockServer.textDocuments.getActive();
      const targetEdit = targetCodeAction.edit.changes[document.uri];
      const [startEdit, endEdit] = targetEdit;
      expect(startEdit.newText).toBe(newCode);
      expect(endEdit.newText).toBe(newCode);
      // expect(endEdit.newText).toBe(newCode); // TODO: attribute
    }
  );
};
