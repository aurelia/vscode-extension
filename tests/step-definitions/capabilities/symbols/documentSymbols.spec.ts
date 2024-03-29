import { StepDefinitions } from 'jest-cucumber';
import { DocumentSymbol } from 'vscode-languageserver';

import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { myMockServer } from '../new-common/project.step';

export const symbolSteps: StepDefinitions = ({ when, then }) => {
  let symbols: DocumentSymbol[] | undefined;

  when(/^I execute Document symbols$/, async () => {
    const uri = UriUtils.toVscodeUri(myMockServer.getActiveFilePath());
    symbols = await myMockServer.getAureliaServer().onDocumentSymbol(uri);
  });

  then(/^I should get (.*) of symbols$/, () => {
    expect(symbols).toBeDefined();
  });
};
