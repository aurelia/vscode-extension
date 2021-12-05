import { StepDefinitions } from 'jest-cucumber';
import { LocationLink } from 'vscode-languageserver';

import { position } from './new-common/file.step';
import { myMockServer } from './new-common/project.step';

export const definitionSteps: StepDefinitions = ({ when, then, and }) => {
  let definitions: LocationLink[] | undefined;

  when(/^I execute Go To Definition$/, async () => {
    const document = myMockServer.textDocuments.getActive();

    definitions = await myMockServer
      .getAureliaServer()
      .onDefinition(document, position);
  });

  then(/^I should land in the file (.*)$/, (fileName: string) => {
    expect(definitions).toBeDefined();
    expect(definitions?.length).toBeGreaterThan(0);

    if (definitions) {
      expect(
        definitions.find((defintion) => defintion.targetUri.includes(fileName))
      ).toBeTruthy();
    }
  });

  and(
    /^the number of definitions should be (.*)$/,
    (numOfDefintions: string) => {
      expect(definitions).toBeDefined();
      expect(definitions?.length).toBeGreaterThan(0);

      if (definitions) {
        expect(definitions.length).toBe(Number(numOfDefintions));
      }
    }
  );
};
