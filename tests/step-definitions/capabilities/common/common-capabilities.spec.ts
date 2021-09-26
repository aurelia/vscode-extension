import { StepDefinitions } from 'jest-cucumber';
import { Position } from 'vscode-html-languageservice';
import { AsyncReturnType } from '../../../../server/src/common/global';
import { Logger } from '../../../../server/src/common/logging/logger';
import { getLanguageModes } from '../../../../server/src/feature/embeddedLanguages/languageModes';
import { myMockServer } from '../../initialization/on-initialized/detecting-on-init.spec';

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
      /* prettier-ignore */ logger.log(`/^I'm replacing the file content with (.*)$/`)

      code = removeCursorFromCode(codeWithCursor);
      myMockServer.textDocuments.changeFirst(code);
      /* prettier-ignore */ logger.log(`after`, { logPerf: true });
    }
  );

  and(
    /^I'm on the line (\d+) at character (.*)$/,
    async (line: number, codeWithCursor: string) => {
      /* prettier-ignore */ logger.log(`/^I'm on the line (\d+) at character (.*)$/`,{logPerf: true});

      code = removeCursorFromCode(codeWithCursor);

      ({ position, languageModes } = await givenImOnTheLineAtCharacter(
        codeWithCursor,
        position,
        Number(line)
      ));
    }
  );
};

export async function givenImOnTheLineAtCharacter(
  codeWithCursor: string,
  position: Position,
  line: number
) {
  const character = findCharacterPosition(codeWithCursor);
  position = Position.create(line, character);

  const { AureliaProjects } = myMockServer.getContainerDirectly();
  const { aureliaProgram } = AureliaProjects.getFirstAureliaProject();
  if (aureliaProgram) {
    languageModes = await getLanguageModes(aureliaProgram);
  }
  return { position, languageModes };
}

export function removeCursorFromCode(code: string): string {
  const [, codeContent] = /^`(.*)`$/.exec(code) ?? [];

  if (codeContent.includes(CURSOR_CHARACTER_1)) {
    const withoutCursor = codeContent.replace(CURSOR_CHARACTER_1, '');
    return withoutCursor;
  }

  const withoutCursor = codeContent.replace(CURSOR_CHARACTER, '');
  return withoutCursor;
}

/**
 * @param input Of the form `<div id="|">`, where "|" represents the cursor.
 * @returns index of cursor.
 */
function findCharacterPosition(input: string): number {
  const [, codeContent] = /^`(.*)`$/.exec(input) ?? [];

  if (codeContent.includes(CURSOR_CHARACTER_1)) {
    const character = codeContent.indexOf(CURSOR_CHARACTER_1);
    return character;
  }

  const character = codeContent.indexOf(CURSOR_CHARACTER);
  return character;
}
