import { StepDefinitions } from 'jest-cucumber';

import { Logger } from '../../../../server/src/common/logging/logger';
import {
  removeCursorFromCode,
  givenImOnTheLineAtCharacter,
} from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

// eslint-disable-next-line import/no-mutable-exports
export let code = '';

const logger = new Logger('[Test] Common capabilities');

export const commonCapabilitiesStep: StepDefinitions = ({ given, and }) => {
  given(
    /^I'm replacing the file content with (.*)$/,
    (codeWithCursor: string) => {
      /* prettier-ignore */ logger.log('/^I\'m replacing the file content with (.*)$/',{env:'test'});

      code = removeCursorFromCode(codeWithCursor);
      myMockServer.textDocuments.changeActive(code);
      const activeDocument = myMockServer.textDocuments.getActive();
      myMockServer
        .getAureliaProgram()
        ?.aureliaComponents.updateOneView(activeDocument);
      // /* prettier-ignore */ logger.log(`after`, { logPerf: true });
    }
  );

  and(
    /^I'm on the line (\d+) at character (.*)$/,
    /**
     * @param line - 0 based
     */
    async (line: number, codeWithCursor: string) => {
      /* prettier-ignore */ logger.log('/^I\'m on the line (d+) at character (.*)$/',{env:'test'});

      code = removeCursorFromCode(codeWithCursor);

      await givenImOnTheLineAtCharacter(codeWithCursor, Number(line));
    }
  );
};
