import * as fs from 'fs';
import * as path from 'path';

import { Position } from 'vscode-html-languageservice';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Logger } from '../../../server/src/common/logging/logger';
import { UriUtils } from '../../../server/src/common/view/uri-utils';

const logger = new Logger('text-documents');

export class MockTextDocuments {
  private textDocuments: TextDocument[] = [];
  private activeTextDocument: TextDocument;

  private readonly CHANGE = 'changes-';
  private readonly INITIAL = '0123';

  private readonly workspaceRootUri: string;

  constructor(workspaceRootUri: string) {
    this.workspaceRootUri = workspaceRootUri;
  }

  public setMany(textDocuments: TextDocument[]): void {
    this.textDocuments = textDocuments;
  }

  public setActive(textDocumentPaths: string[]): MockTextDocuments {
    const target = this.find(textDocumentPaths[0]);
    if (target) {
      this.activeTextDocument = target;
    } else {
      logger.log('No document found ');
    }

    return this;
  }

  public getActive(): TextDocument {
    return this.activeTextDocument;
  }

  public push(textDocument: TextDocument): void {
    this.textDocuments.push(textDocument);
  }

  public getAll(): TextDocument[] {
    if (this.textDocuments === undefined) {
      throw new Error(
        '[MockConnection]: No TextDocument. Provide one in the constructor, or call mockTextDocuments (fluentApi).'
      );
    }

    return this.textDocuments;
  }

  public getFirst(): TextDocument {
    return this.textDocuments[0];
  }

  public create(uri: string): TextDocument {
    const path = UriUtils.toPath(uri);
    const fileContent = fs.readFileSync(path, 'utf-8');
    const textDocument = TextDocument.create(uri, 'typescript', 1, fileContent);
    return textDocument;
  }

  public change(
    targetDocument: TextDocument | undefined,
    change: string
  ): void {
    if (!targetDocument) return;

    const startPosition: Position = { line: 0, character: 0 };
    const endPosition: Position = { line: 0, character: 0 };
    TextDocument.update(
      targetDocument,
      [{ range: { start: startPosition, end: endPosition }, text: change }],
      targetDocument.version + 1
    );
  }

  public changeActive(change: string = this.CHANGE): MockTextDocuments {
    const targetDocument = this.getActive();
    this.change(targetDocument, change);
    return this;
  }

  private find(documentPath: string): TextDocument | undefined {
    const targetDocument = this.textDocuments.find((document) =>
      document.uri.includes(documentPath)
    );
    return targetDocument;
  }

  public findAndChange(
    documentPath: string,
    change: string = this.CHANGE
  ): MockTextDocuments {
    const targetDocument = this.textDocuments.find((document) =>
      document.uri.includes(documentPath)
    );
    this.change(targetDocument, change);
    return this;
  }

  private initMock(fileUris: string[]) {
    const textDocuments = fileUris.map((uri) => {
      const path = UriUtils.toPath(uri);
      const fileContent = fs.readFileSync(path, 'utf-8');
      const textDocument = TextDocument.create(
        uri,
        'typescript',
        1,
        fileContent
      );
      return textDocument;
    });

    this.setMany(textDocuments);
  }

  public mock(
    filePaths: string[] = [],
    options: { isUri?: boolean; isRelative?: boolean } = {
      isUri: false,
      isRelative: true,
    }
  ): MockTextDocuments {
    const fileUris = this.convertToFileUris(options, filePaths);

    if (this.textDocuments.length === 0) {
      this.initMock(fileUris);
      return this;
    }

    // Don't add duplicate

    fileUris.forEach((uri) => {
      const targetDocument = this.getAll().find((textDocument) => {
        return textDocument.uri === uri;
      });

      if (targetDocument) return;

      const newTextDocument = this.create(uri);
      this.textDocuments.push(newTextDocument);
    });

    return this;
  }

  private convertToFileUris(
    options: { isUri?: boolean; isRelative?: boolean },
    fileUris: string[]
  ): string[] {
    if (options.isRelative !== undefined) {
      fileUris = this.changeToRelative(fileUris);
    }
    if (options.isUri !== undefined) {
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
