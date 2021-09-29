import { StepDefinitions } from 'jest-cucumber';
import { LocationLink } from 'vscode-languageserver';

import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { DefinitionResult } from '../../../server/src/feature/definition/getDefinition';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';
import { languageModes, position } from './common/common-capabilities.spec';

export const definitionSteps: StepDefinitions = ({ when, then }) => {
  let definition: LocationLink[];

  when(/^I execute Go To Definition$/, async () => {
    const document = myMockServer.textDocuments.getFirst();

    definition = await myMockServer
      .getAureliaServer()
      .onDefinition(
        document.getText(),
        position,
        UriUtils.toPath(document.uri),
        languageModes
      );
  });

  then(/^I should land in the file (.*)$/, (viewModelFileName: string) => {
    expect(definition[0].targetUri).toContain(viewModelFileName);
  });
};
