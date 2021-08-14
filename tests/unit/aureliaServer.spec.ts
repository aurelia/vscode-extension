import { ok, strictEqual } from 'assert';
import { Container } from 'aurelia-dependency-injection';
import { MONOREPO } from './helpers/file-path-mocks';
import { MockServer } from './helpers/test-setup';
import { Logger } from 'culog';

const logger = new Logger({scope: 'auServer'});

describe('Aurelia Server', () => {
  it.skip('onConnectionInitialized - With active Aurelia projects', async () => {
    const testContainer = new Container();
    const mockServer = new MockServer(testContainer);
    await mockServer.onConnectionInitialized({
      include: ['aurelia', 'burelia'],
    });

    const testAureliaExtension = mockServer.getContainerDirectly()
      .AureliaExtension;

    const mockTextDocumentPaths = mockServer
      .mockTextDocuments([
        MONOREPO['package-aurelia/aurelia/aurelia.ts'],
        MONOREPO['package-burelia/burelia/burelia.ts'],
      ])
      .getTextDocuments()
      .map((mockTextDocument) => {
        return mockTextDocument.uri;
      });

    await testAureliaExtension.hydrateAureliaProjectList(mockTextDocumentPaths);
    // await testAureliaExtension.hydrateAureliaProjectList([]);
    const auProjectList = testAureliaExtension.getAureliaProjectList();
    strictEqual(auProjectList.length, 2);
    ok(auProjectList[0].aureliaProgram);
    ok(auProjectList[1].aureliaProgram);
  });

  it.only('onConnectionInitialized - WithOUT active Aurelia projects', async () => {
    const testContainer = new Container();
    const mockServer = new MockServer(testContainer);
    await mockServer.onConnectionInitialized({
      include: ['aurelia', 'burelia'],
    });

    // logger.setLogOptions({focusedLogging: true})
    // logger.debug(['hi'])


    // TODO: Addd culog <<<<<<<

    const testAureliaExtension = mockServer.getContainerDirectly()
      .AureliaExtension;

    await testAureliaExtension.hydrateAureliaProjectList([]);
    const auProjectList = testAureliaExtension.getAureliaProjectList();
    // strictEqual(auProjectList.length, 2);
    strictEqual(auProjectList.length, 3);
    strictEqual(auProjectList[0].aureliaProgram, null);
    strictEqual(auProjectList[1].aureliaProgram, null);
  });

  it.skip('onConnectionDidChangeContent', async () => {
    const testContainer = new Container();
    const mockServer = new MockServer(testContainer);
    await mockServer.onConnectionInitialized({
      include: ['aurelia', 'burelia'],
    });

    const testAureliaExtension = mockServer.getContainerDirectly()
      .AureliaExtension;

    const [mockTextDocument] = mockServer
      .mockTextDocuments([MONOREPO['package-aurelia/aurelia/aurelia.ts']])
      .getTextDocuments();
    await mockServer.onConnectionDidChangeContent({
      document: mockTextDocument,
    });

    const auProjList = testAureliaExtension.getAureliaProjectList(); /* ? */

    strictEqual(auProjList.length, 2);
    ok(auProjList[0].aureliaProgram);
    strictEqual(auProjList[1].aureliaProgram, null);
  });
});
