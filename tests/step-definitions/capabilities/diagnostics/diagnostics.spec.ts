import { StepDefinitions } from 'jest-cucumber';
import { PublishDiagnosticsParams } from 'vscode-languageserver-protocol';
import { position } from '../new-common/file.step';

// import { Logger } from '../../../../server/src/common/logging/logger';
import { myMockServer } from '../new-common/project.step';

let diagnosticsParams: PublishDiagnosticsParams | undefined;

export const diagnosticsSteps: StepDefinitions = ({ when, then }) => {
  // then(/^the following (.*) should show up$/, (diagnostic: string) => {

  when('I run Diagnostics for the active file', async () => {
    const document = myMockServer.textDocuments.getActive();

    diagnosticsParams = await myMockServer
      .getAureliaServer()
      .sendDiagnostics(document);
  });

  then(/^the following (.*) should show up$/, (diagnosticMessage: string) => {
    expect(diagnosticsParams).toBeDefined();
    if (diagnosticsParams === undefined) return;

    diagnosticsParams.diagnostics.map(d => d.message)/*?*/
    const targetDiagnostic = diagnosticsParams.diagnostics.find(
      (diagnostic) => {
        const isInLine = diagnostic.range.start.line === position.line
        const isSameMessage = diagnostic.message === diagnosticMessage;
        return isInLine && isSameMessage;
      }
    );

    expect(targetDiagnostic).toBeDefined();
    if (!targetDiagnostic) return;

    expect(targetDiagnostic.message).toBe(diagnosticMessage);
    expect(targetDiagnostic.range.start.line).toBe(position.line);

    expect(true).toBeFalsy();
  });
};
