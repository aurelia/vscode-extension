import { StepDefinitions } from 'jest-cucumber';
import { LocationLink } from 'vscode-languageserver';

import { testError } from '../../common/errors/TestErrors';
import { getPathsFromFileNames } from '../../common/file-path-mocks';
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

  and(/^I execute Go To Definition in the file "(.*)"$/, async (fileName: string) => {
    const uri = myMockServer.getWorkspaceUri();
    testError.verifyFileInProject(uri, fileName);
    const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
    const document = myMockServer.textDocuments.setActive(textDocumentPaths).getActive();

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

  then(
    /^the defintion in "(.*)" should be correct$/,
    (fileName: string) => {
      expect(definitions).toBeDefined();
      expect(definitions?.length).toBeGreaterThan(0);

      if (!definitions) return;

      const targetDefinitions = definitions.filter(def => def.targetUri.includes(fileName));

      expect(targetDefinitions[0].targetRange.start.line).toBe(1);
      expect(targetDefinitions[0].targetRange.end.line).toBe(1);
      expect(targetDefinitions[1].targetRange.start.line).toBe(15);
      expect(targetDefinitions[1].targetRange.end.line).toBe(15);
    });

  and(
    /^the number of definitions should be (.*)$/,
    (numOfDefintions: string) => {
      if (Number(numOfDefintions) === 0) {
        if (definitions === undefined) {
          expect(definitions).toBeUndefined();
          return;
        }

        expect(definitions.length).toBe(0);
        return;
      }

      expect(definitions).toBeDefined();
      expect(definitions?.length).toBeGreaterThan(0);

      if (definitions) {
        expect(definitions.length).toBe(Number(numOfDefintions));
      }
    }
  );
};
