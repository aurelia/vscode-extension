import { StepDefinitions } from 'jest-cucumber';
import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { DefinitionResult } from '../../../server/src/feature/definition/getDefinition';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';
import { languageModes, position } from './common/common-capabilities.spec';

export const definitionSteps: StepDefinitions = ({ when, then }) => {
  let definition: DefinitionResult;

  when(/^I execute Go To Definition$/, async () => {
    const document = myMockServer.textDocuments.getFirst();
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjectFiles.getFirstAureiaProject();

    definition = await myMockServer
      .getAureliaServer()
      .onDefinition(
        document.getText(),
        position,
        UriUtils.toPath(document.uri),
        languageModes,
        aureliaProgram
      );
  });

  then(/^I should land in the file (.*)$/, (viewModelFileName: string) => {
    expect(definition.viewModelFilePath).toContain(viewModelFileName);
  });
};
