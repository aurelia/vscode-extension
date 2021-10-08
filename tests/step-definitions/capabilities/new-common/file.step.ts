import { Position } from 'vscode-languageserver';
import { AsyncReturnType } from '../../../../server/src/common/global';
import { getLanguageModes } from '../../../../server/src/feature/embeddedLanguages/languageModes';
import { myMockServer } from './project.step';

export let languageModes: AsyncReturnType<typeof getLanguageModes>;
export let codeForCharacter;
export let code = '';

const CURSOR_CHARACTER = '|';
const CURSOR_CHARACTER_1 = '>>|<<';

export async function givenImOnTheLineAtCharacter(
  codeWithCursor: string,
  line: number
) {
  const character = findCharacterPosition(codeWithCursor);
  const position = Position.create(line, character);

  const {
    AureliaProjects,
    DocumentSettings,
  } = myMockServer.getContainerDirectly();
  const { aureliaProgram } = AureliaProjects.getFirstAureliaProject();
  if (aureliaProgram) {
    languageModes = await getLanguageModes(
      aureliaProgram,
      DocumentSettings.getSettings()
    );
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
 * @param input - Of the form `<div id="|">`, where "|" represents the cursor.
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
