import { StepDefinitions } from 'jest-cucumber';

// import { Logger } from '../../../../server/src/common/logging/logger';
import { myMockServer } from '../new-common/project.step';

export const diagnosticsSteps: StepDefinitions = ({ when, then }) => {
  // then(/^the following (.*) should show up$/, (diagnostic: string) => {

  when('I run Diagnostics for the active file', async () => {
    const document = myMockServer.textDocuments.getActive();

    const diagnostics = await myMockServer.getAureliaServer().sendDiagnostics(document);
     diagnostics;/* ? */

    expect(true).toBeFalsy();
  });

  then(/^the following (.*) should show up$/, () => {
    // const document = myMockServer.textDocuments.getActive();
    // const diagnostics = myMockServer
    //   .getAureliaServer()
    //   .sendDiagnostics(document);
  });
};
