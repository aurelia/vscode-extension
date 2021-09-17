import { Container } from 'aurelia-dependency-injection';
import path = require('path');
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjectFiles } from '../../server/src/common/AureliaProjectFiles';
import {
  ExtensionSettings,
  DocumentSettings,
  IAureliaProjectSetting,
} from '../../server/src/configuration/DocumentSettings';
import { globalContainer } from '../../server/src/container';
import { AureliaServer } from '../../server/src/core/aureliaServer';
import { AureliaProgram } from '../../server/src/viewModel/AureliaProgram';
import { findProjectRoot } from './find-project-root';

const testsDir = findProjectRoot();
const monorepoFixtureDir = path.resolve(
  testsDir,
  'tests/testFixture/src/monorepo'
);
const rootDirectory = `file:/${monorepoFixtureDir}`;

export class MockServer {
  private aureliaServer: AureliaServer;
  private textDocuments: TextDocument[] = [];

  private readonly CHANGE = 'changes-';
  private readonly INITIAL = '0123';

  constructor(
    private readonly container: Container = globalContainer,
    private workspaceRootUri: string = rootDirectory,
    private readonly extensionSettings: ExtensionSettings = {},
    private readonly activeDocuments: TextDocument[] = []
  ) {
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

  private pushToTextDocuments(textDocument: TextDocument): void {
    this.textDocuments.push(textDocument);
  }

  public getTextDocuments(): TextDocument[] {
    if (this.textDocuments === undefined) {
      throw new Error(
        '[MockConnection]: No TextDocument. Provide one in the constructor, or call mockTextDocuments (fluentApi).'
      );
    }

    return this.textDocuments;
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

  mockTextDocuments(
    filePaths: string[] = [],
    options: { isUri?: boolean; isRelative?: boolean } = {
      isUri: false,
      isRelative: true,
    }
  ): MockServer {
    const fileUris = this.convertToFileUris(options, filePaths);

    if (this.textDocuments.length === 0) {
      this.initMockTextDocuments(fileUris);
      return this;
    }

    // Don't add duplicate

    fileUris.forEach((uri) => {
      const targetDocument = this.textDocuments.find((textDocument) => {
        return textDocument.uri === uri;
      });

      if (targetDocument) return;

      console.log('TODO: add');
      this.pushToTextDocuments(targetDocument);
    });

    return this;
  }

  changeTextDocument(
    documentPath: string,
    change: string = this.CHANGE
  ): MockServer {
    const targetDocument = this.getTextDocuments().find((document) =>
      document.uri.includes(documentPath)
    );
    const startPosition: Position = { line: 0, character: 0 };
    const endPosition: Position = { line: 0, character: 0 };
    TextDocument.update(
      targetDocument,
      [{ range: { start: startPosition, end: endPosition }, text: change }],
      targetDocument.version + 1
    );
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

  private initMockTextDocuments(fileUris: string[]) {
    const textDocuments = fileUris.map((uri) => {
      const textDocument = TextDocument.create(
        uri,
        'typescript',
        1,
        this.INITIAL
      );
      return textDocument;
    });

    this.setTextDocuments(textDocuments);
  }

  private convertToFileUris(
    options: { isUri?: boolean; isRelative?: boolean },
    fileUris: string[]
  ): string[] {
    if (options.isRelative) {
      fileUris = this.changeToRelative(fileUris);
    }
    if (!options.isUri) {
      fileUris = this.convertToFileUri(fileUris);
    }
    return fileUris;
  }

  private changeToRelative(fileUris: string[]) {
    fileUris = fileUris.map((uri) => {
      const absPaths = path.resolve(this.workspaceRootUri, uri);
      return absPaths;
    });
    return fileUris;
  }

  private convertToFileUri(fileUris: string[]) {
    fileUris = fileUris.map((uri) => {
      const convertToUri = `file:/${uri}`;
      return convertToUri;
    });
    return fileUris;
  }
}
