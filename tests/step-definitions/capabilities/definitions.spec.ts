import { StepDefinitions } from 'jest-cucumber';
import { LocationLink } from 'vscode-languageserver';

import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { position, languageModes } from './new-common/file.step';
import { myMockServer } from './new-common/project.step';

export const definitionSteps: StepDefinitions = ({ when, then }) => {
  let definition: LocationLink[] | undefined;

  when(/^I execute Go To Definition$/, async () => {
    const document = myMockServer.textDocuments.getActive();

    definition = await myMockServer
      .getAureliaServer()
      .onDefinition(document, position, languageModes);
  });

  then(/^I should land in the file (.*)$/, (fileName: string) => {
    expect(definition).toBeTruthy();
    if (definition) {
      expect(definition[0].targetUri).toContain(fileName);
    }
  });
};
