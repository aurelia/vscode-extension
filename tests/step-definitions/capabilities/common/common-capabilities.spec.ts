import { StepDefinitions } from 'jest-cucumber';
import { Position } from 'vscode-html-languageservice';

import { AsyncReturnType } from '../../../../server/src/common/global';
import { Logger } from '../../../../server/src/common/logging/logger';
import { getLanguageModes } from '../../../../server/src/core/embeddedLanguages/languageModes';

import {
  removeCursorFromCode,
  givenImOnTheLineAtCharacter,
} from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

export const CURSOR_CHARACTER = '|';
export const CURSOR_CHARACTER_1 = '>>|<<';

export let languageModes: AsyncReturnType<typeof getLanguageModes>;
export let position: Position;
export let codeForCharacter;
export let code = '';

const logger = new Logger('[Test] Common capabilities');

export const commonCapabilitiesStep: StepDefinitions = ({ given, and }) => {
  given(
    /^I'm replacing the file content with (.*)$/,
    (codeWithCursor: string) => {
      /* prettier-ignore */ logger.log('/^I\'m replacing the file content with (.*)$/',{logPerf: true});

      code = removeCursorFromCode(codeWithCursor);
      myMockServer.textDocuments.changeFirst(code);
      // /* prettier-ignore */ logger.log(`after`, { logPerf: true });
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
};
