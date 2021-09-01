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
import { findProjectRoot } from './find-project-root';

__dirname; /*?*/
// const projectRoot = findProjectRoot()
//  projectRoot/*?*/
const testsDir = findProjectRoot();
const monorepoFixtureDir = path.resolve(
  testsDir,
  'tests/testFixture/src/monorepo'
);
const rootDirectory = `file:/${monorepoFixtureDir}`;

export class MockServer {
  public aureliaServer: AureliaServer;

  private textDocuments: TextDocument[] = [];

  constructor(
    private readonly container: Container = globalContainer,
    private readonly workspaceRootUri: string = rootDirectory,
    private readonly extensionSettings: ExtensionSettings = {},
    private readonly activeDocuments: TextDocument[] = []
  ) {
    this.container === globalContainer; /*?*/
    this.aureliaServer = new AureliaServer(this.container);
  }

  log(pluck: (input: MockServer) => any): MockServer {
    /* prettier-ignore */
    const logValue = pluck(this);
    console.log('TCL: MockConnection -> log -> input', logValue);
    return this;
  }

  private setTextDocuments(textDocuments: TextDocument[]): void {
    this.textDocuments = textDocuments;
  }
  public getTextDocuments(): TextDocument[] {
    if (this.textDocuments === undefined) {
      throw new Error(
        '[MockConnection]: No TextDocument. Provide one in the constructor, or call mockTextDocuments (fluentApi).'
      );
    }

    return this.textDocuments;
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

  mockTextDocuments(
    fileUris: string[],
    options: { isUri: boolean; isRelative: boolean } = {
      isUri: false,
      isRelative: true,
    }
  ): MockServer {
    if (options.isRelative) {
      fileUris = fileUris.map((uri) => {
        const absPaths = path.resolve(this.workspaceRootUri, uri);
        return absPaths;
      });
    }
    if (!options.isUri) {
      fileUris = fileUris.map((uri) => {
        const convertToUri = `file:/${uri}`;
        return convertToUri;
      });
    }

    const textDocuments = fileUris.map((uri) => {
      const textDocument = TextDocument.create(uri, 'typescript', 1, '');
      return textDocument;
    });

    this.setTextDocuments(textDocuments);

    return this;
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
      this.textDocuments
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
