import { StepDefinitions } from 'jest-cucumber';
import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { DefinitionResult } from '../../../server/src/feature/definition/getDefinition';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';
import {
  languageModes,
  modeAndRegion,
  position,
} from './common/common-capabilities.spec';

export const definitionSteps: StepDefinitions = ({ when, then }) => {
  let definition: DefinitionResult;

  when(/^I execute Go To Definition on (.*)$/, async (targetWord: string) => {
    const { mode } = modeAndRegion;
    const document = myMockServer.textDocuments.getFirst();
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjectFiles.getFirstAureiaProject();

    if (!mode?.doDefinition) return;

    definition = await myMockServer
      .getAureliaServer()
      .onDefinition(
        document.getText(),
        position,
        targetWord,
        UriUtils.toPath(document.uri),
        languageModes,
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
