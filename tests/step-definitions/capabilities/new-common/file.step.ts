import { Position } from 'vscode-languageserver';

import { AsyncReturnType } from '../../../../server/src/common/global';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { getLanguageModes } from '../../../../server/src/core/embeddedLanguages/languageModes';
import { testError } from '../../../common/errors/TestErrors';
import { myMockServer } from './project.step';

export let languageModes: AsyncReturnType<typeof getLanguageModes>;
export let position: Position;
export let codeForCharacter;

const CURSOR_CHARACTER = '|';
const CURSOR_CHARACTER_1 = '>>|<<';

export async function givenImOnTheLineAtCharacter(
  codeWithCursor: string,
  line: number
) {
  const character = findCursorCharacterPosition(codeWithCursor);
  if (character === -1) {
    testError.log(
      `Please add Cursor position to input, was: ${codeWithCursor}`
    );
  }
  position = Position.create(line, character);
  position; /*?*/

  const {
    AureliaProjects,
    DocumentSettings,
  } = myMockServer.getContainerDirectly();
  const tsConfigPath = UriUtils.toPath(myMockServer.getWorkspaceUri());
  const targetProject = AureliaProjects.getBy(tsConfigPath);
  if (!targetProject) return;
  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return;

  languageModes = await getLanguageModes(
    aureliaProgram,
    DocumentSettings.getSettings()
  );
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
function findCursorCharacterPosition(input: string): number {
  const [, codeContent] = /^`(.*)`$/.exec(input) ?? [];

  if (codeContent.includes(CURSOR_CHARACTER_1)) {
    const character = codeContent.indexOf(CURSOR_CHARACTER_1);
    return character;
  }

  const character = codeContent.indexOf(CURSOR_CHARACTER);
  return character;
}
