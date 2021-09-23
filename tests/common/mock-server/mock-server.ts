import { Container } from 'aurelia-dependency-injection';
import path = require('path');
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjectFiles } from '../../../server/src/common/AureliaProjectFiles';
import {
  ExtensionSettings,
  DocumentSettings,
  IAureliaProjectSetting,
} from '../../../server/src/configuration/DocumentSettings';
import { globalContainer } from '../../../server/src/container';
import { AureliaServer } from '../../../server/src/core/aureliaServer';
import { AureliaProgram } from '../../../server/src/viewModel/AureliaProgram';
import { findProjectRoot } from '../find-project-root';
import { MockTextDocuments } from './text-documents';

const testsDir = findProjectRoot();
const monorepoFixtureDir = path.resolve(
  testsDir,
  'tests/testFixture/src/monorepo'
);
const rootDirectory = `file:/${monorepoFixtureDir}`;

export class MockServer {
  public textDocuments: MockTextDocuments;

  private aureliaServer: AureliaServer;

  constructor(
    private readonly container: Container = globalContainer,
    private workspaceRootUri: string = rootDirectory,
    private readonly extensionSettings: ExtensionSettings = {},
    private readonly activeDocuments: TextDocument[] = []
  ) {
    this.aureliaServer = new AureliaServer(
      this.container,
      this.extensionSettings
    );
    this.textDocuments = new MockTextDocuments(this.workspaceRootUri);
  }

  log(pluck: (input: MockServer) => any): MockServer {
    /* prettier-ignore */
    const logValue = pluck(this);
    console.log('TCL: MockConnection -> log -> input', logValue);
    return this;
  }

  public setWorkspaceUri(uri: string): void {
    this.workspaceRootUri = uri;
  }
  public getWorkspaceUri(): string {
    return this.workspaceRootUri;
  }

  public getContainer(): Container {
    return this.container;
  }

  /**
   * Just path a string, instead of
   * ```ts
   * #getContainer().get(MyClass)
   * ```
   */
  public getContainerDirectly() {
    return {
      AureliaProjectFiles: this.container.get(AureliaProjectFiles),
      AureliaProgram: this.container.get(AureliaProgram),
      DocumentSettings: this.container.get(DocumentSettings),
    };
  }

  public getAureliaServer(): AureliaServer {
    return this.aureliaServer;
  }

  /**
   * Goal: Can access data, after method called
   */
  async onConnectionInitialized(
    aureliaProject: Partial<IAureliaProjectSetting>
  ) {
    await this.aureliaServer.onConnectionInitialized(
      {
        aureliaProject: {
          exclude: undefined,
          rootDirectory: this.workspaceRootUri,
          ...aureliaProject,
        },
      },
      this.textDocuments.getAll()
    );
  }

  /**
   * 1. Check if document is inside aurelia project
   * 2. Init AureliaProject
   * 3. Hydrate AureliaProject
   */
  async onConnectionDidChangeContent(
    change: TextDocumentChangeEvent<TextDocument>
  ) {
    await this.aureliaServer.onConnectionDidChangeContent(change);
  }
}
