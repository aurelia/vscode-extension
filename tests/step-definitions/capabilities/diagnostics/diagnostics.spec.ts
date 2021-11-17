import { StepDefinitions } from 'jest-cucumber';

import { Logger } from '../../../../server/src/common/logging/logger';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('diagnostics.spec');

export const diagnosticsSteps: StepDefinitions = ({ when, then }) => {
  then(/^the following (.*) should show up$/, (diagnostic: string) => {
    const document = myMockServer.textDocuments.getActive();
    const diagnostics = myMockServer
      .getAureliaServer()
      .sendDiagnostics(document);

  });
};
