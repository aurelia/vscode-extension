import { StepDefinitions } from 'jest-cucumber';

// import { Logger } from '../../../../server/src/common/logging/logger';
// import { myMockServer } from '../new-common/project.step';

export const diagnosticsSteps: StepDefinitions = ({ then }) => {
  // then(/^the following (.*) should show up$/, (diagnostic: string) => {
  then(/^the following (.*) should show up$/, () => {
    // const document = myMockServer.textDocuments.getActive();
    // const diagnostics = myMockServer
    //   .getAureliaServer()
    //   .sendDiagnostics(document);
  });
};
