import path = require('path');

import { Container } from 'aurelia-dependency-injection';
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { AureliaProjects } from '../../../server/src/core/AureliaProjects';
import { AureliaServer } from '../../../server/src/core/AureliaServer';
import { globalContainer } from '../../../server/src/core/container';
import { createTsMorphProject } from '../../../server/src/core/tsMorph/AureliaTsMorph';
import {
  ExtensionSettings,
  DocumentSettings,
  IAureliaProjectSetting,
} from '../../../server/src/feature/configuration/DocumentSettings';
import { getPathsFromFileNames } from '../file-path-mocks';
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

  private readonly aureliaServer: AureliaServer;
  private readonly AureliaProjects: AureliaProjects;
  private readonly DocumentSettings: DocumentSettings;
  private activeFilePath: string;

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

    this.AureliaProjects = this.container.get(AureliaProjects);
    this.DocumentSettings = this.container.get(DocumentSettings);
  }

  log(pluck: (input: MockServer) => any): MockServer {
    /* prettier-ignore */
    const logValue = pluck(this);
    console.log('TCL: MockConnection -> log -> input', logValue);
    return this;
  }

  public createMockProgram(filePath?: string) {
    if (!filePath) {
      filePath = this.getActiveFilePath();
    }

    const project = createTsMorphProject();
    project.addSourceFileAtPath(filePath);
    const program = project.getProgram().compilerObject;
    const result = {
      get: () => program,
      getSourceFile: () => program.getSourceFile(filePath!),
    };

    return result;
  }

  public setActiveFilePath(fileName: string) {
    this.activeFilePath = getPathsFromFileNames(this.workspaceRootUri, [
      fileName,
    ])[0];
  }

  public getActiveFilePath() {
    return this.activeFilePath;
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
      AureliaProjects: this.AureliaProjects,
      DocumentSettings: this.DocumentSettings,
    };
  }

  public getAureliaServer(): AureliaServer {
    return this.aureliaServer;
  }

  public getAureliaProgram() {
    const targetProject = this.AureliaProjects.getBy(
      UriUtils.toPath(this.workspaceRootUri)
    );
    const aureliaProgram = targetProject?.aureliaProgram;

    if (!aureliaProgram) return;

    return aureliaProgram;
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
