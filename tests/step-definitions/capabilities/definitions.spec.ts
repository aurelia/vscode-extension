import { StepDefinitions } from 'jest-cucumber';
import { Position } from 'vscode-html-languageservice';
import { AsyncReturnType } from '../../../server/src/common/global';
import { DefinitionResult } from '../../../server/src/feature/definition/getDefinition';
import {
  getLanguageModes,
  LanguageModes,
} from '../../../server/src/feature/embeddedLanguages/languageModes';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';

export const CURSOR_CHARACTER = '|';
export const CURSOR_CHARACTER_1 = '>>|<<';

export const completionSteps: StepDefinitions = ({ given, when, then }) => {
  let languageModes: AsyncReturnType<typeof getLanguageModes>;
  let modeAndRegion: AsyncReturnType<
    LanguageModes['getModeAndRegionAtPosition']
  >;
  let position: Position;
  let definition: DefinitionResult;

  given(
    /^I'm on the line (\d+) at character (.*)$/,
    async (line: number, codeForCharacter: string) => {
      const character = findCharacterPosition(codeForCharacter);
      character; /*?*/
      position = Position.create(line, character);

      const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
      const { aureliaProgram } = AureliaProjectFiles.getFirstAureiaProject();
      languageModes = await getLanguageModes(aureliaProgram);
      const document = myMockServer.textDocuments.getFirst();
      modeAndRegion = await languageModes.getModeAndRegionAtPosition(
        document,
        position
      );
    }
  );
  when(/^I execute Go To Definition on (.*)$/, async (targetWord: string) => {
    const { mode, region } = modeAndRegion;
    const document = myMockServer.textDocuments.getFirst();
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjectFiles.getFirstAureiaProject();

    if (!mode?.doDefinition) return;

    definition = await mode.doDefinition(
      document,
      position,
      targetWord,
      region,
      aureliaProgram
    );
  });

  then(
    /^I should land in the view model (.*)$/,
    (viewModelFileName: string) => {
      expect(definition.viewModelFilePath).toContain(viewModelFileName);
    }
  );
};

/**
 * @param input Of the form `<div id="|">`
 */
function findCharacterPosition(input: string) {
  const [, codeContent] = /^`(.*)`$/.exec(input) ?? [];

  if (codeContent.includes(CURSOR_CHARACTER_1)) {
    const character = codeContent.indexOf(CURSOR_CHARACTER_1);
    const finalCharacter = character + 3; // + '>>|'.length

    return finalCharacter;
  }

  const character = codeContent.indexOf(CURSOR_CHARACTER);
  return character;
}
