import { StepDefinitions } from 'jest-cucumber';
import { Position, TextDocument } from 'vscode-html-languageservice';
import { AsyncReturnType } from '../../../../server/src/common/global';
import {
  LanguageModes,
  LanguageModeWithRegion,
  getLanguageModes,
} from '../../../../server/src/feature/embeddedLanguages/languageModes';
import { myMockServer } from '../../initialization/on-initialized/detecting-on-init.spec';

export const CURSOR_CHARACTER = '|';
export const CURSOR_CHARACTER_1 = '>>|<<';

export let languageModes: AsyncReturnType<typeof getLanguageModes>;
export let modeAndRegion: AsyncReturnType<
  LanguageModes['getModeAndRegionAtPosition']
>;
export let position: Position;
export let codeForCharacter;
export let code = '';

export const commonCapabilitiesStep: StepDefinitions = ({ given }) => {
  given(
    /^I'm replacing the file content with (.*)$/,
    (codeWithCursor: string) => {
      code = removeCursorFromCode(codeWithCursor);
      myMockServer.textDocuments.changeFirst(code);
    }
  );

  given(
    /^I'm on the line (\d+) at character (.*)$/,
    async (line: number, codeWithCursor: string) => {
      code = removeCursorFromCode(codeWithCursor);

      ({
        position,
        languageModes,
        modeAndRegion,
      } = await givenImOnTheLineAtCharacter(
        codeWithCursor,
        position,
        Number(line),
        languageModes,
        modeAndRegion
      ));
    }
  );
};

export async function givenImOnTheLineAtCharacter(
  codeWithCursor: string,
  position: Position,
  line: number,
  languageModes: LanguageModes,
  modeAndRegion: LanguageModeWithRegion
) {
  // <div if.bind="m |"></div>
  codeWithCursor; /*?*/
  const character = findCharacterPosition(codeWithCursor);
  character; /*?*/
  position = Position.create(line, character);
  position; /*?*/

  const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
  const { aureliaProgram } = AureliaProjectFiles.getFirstAureiaProject();
  languageModes = await getLanguageModes(aureliaProgram);
  const document = myMockServer.textDocuments.getFirst();
  modeAndRegion = await languageModes.getModeAndRegionAtPosition(
    document,
    position
  );
  return { position, languageModes, modeAndRegion };
}

function removeCursorFromCode(code: string): string {
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
