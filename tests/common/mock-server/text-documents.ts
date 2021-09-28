import { Position } from 'vscode-html-languageservice';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as path from 'path';
import * as fs from 'fs';
import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { Logger } from '../../../server/src/common/logging/logger';

const logger = new Logger('text-documents');

export class MockTextDocuments {
  private textDocuments: TextDocument[] = [];

  private readonly CHANGE = 'changes-';
  private readonly INITIAL = '0123';

  private workspaceRootUri: any;

  constructor(workspaceRootUri) {
    this.workspaceRootUri = workspaceRootUri;
  }

  public setMany(textDocuments: TextDocument[]): void {
    this.textDocuments = textDocuments;
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

  public change(targetDocument: TextDocument | undefined, change: string) {
    if (!targetDocument) return;

    const startPosition: Position = { line: 0, character: 0 };
    const endPosition: Position = { line: 0, character: 0 };
    TextDocument.update(
      targetDocument,
      [{ range: { start: startPosition, end: endPosition }, text: change }],
      targetDocument.version + 1
    );
  }

  public changeFirst(change: string = this.CHANGE): MockTextDocuments {
    const targetDocument = this.textDocuments[0];
    this.change(targetDocument, change);
    return this;
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

  mock(
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

      console.log('TODO: add');
      // this.textDocuments.push(targetDocument);
    });

    return this;
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
