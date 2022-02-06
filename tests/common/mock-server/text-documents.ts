import * as fs from 'fs';
import * as nodePath from 'path';

import { Position } from 'vscode-html-languageservice';
import { TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { Logger } from '../../../server/src/common/logging/logger';
import { StringUtils } from '../../../server/src/common/string/StringUtils';
import { UriUtils } from '../../../server/src/common/view/uri-utils';

const logger = new Logger('text-documents');

export class MockTextDocuments extends TextDocuments<TextDocument> {
  private textDocuments: TextDocument[] = [];
  private activeTextDocument: TextDocument;

  private readonly CHANGE = 'changes-';
  private readonly INITIAL = '0123';

  private readonly workspaceRootUri: string;

  constructor(workspaceRootUri: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super({} as unknown);
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

  public all() {
    return this.getAll();
  }

  public getFirst(): TextDocument {
    return this.textDocuments[0];
  }

  public get(uri: string): TextDocument | undefined {
    const target = this.getAll().find((document) => document.uri === uri);
    return target;
  }

  public create(uri: string): TextDocument {
    const path = UriUtils.toSysPath(uri);
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
    const endChar = targetDocument.getText().length;
    const endPosition: Position = { line: 0, character: endChar };
    const range = { start: startPosition, end: endPosition };
    TextDocument.update(
      targetDocument,
      [{ range: range, text: change }],
      targetDocument.version + 1
    );
  }

  public changeActive(change: string = this.CHANGE): MockTextDocuments {
    const targetDocument = this.getActive();
    this.change(targetDocument, change);
    return this;
  }

  public find(documentPath: string): TextDocument | undefined {
    const targetDocument = this.textDocuments.find((document) => {
      const sysPath = UriUtils.toSysPath(document.uri);
      return sysPath.includes(documentPath);
    });
    return targetDocument;
  }

  public findAndChange(
    documentPath: string,
    change: string = this.CHANGE
  ): MockTextDocuments {
    const targetDocument = this.find(documentPath);
    this.change(targetDocument, change);
    return this;
  }

  private initMock(filePaths: string[]) {
    const textDocuments = filePaths.map((path) => {
      const fileContent = fs.readFileSync(path, 'utf-8');
      const asUri = UriUtils.toVscodeUri(path);
      // We want LF and not CRLF for testing purposes
      const ensureLfEolFileContent = StringUtils.replaceAll(
        fileContent,
        '\r\n',
        '\n'
      );

      const textDocument = TextDocument.create(
        asUri,
        'typescript',
        1,
        ensureLfEolFileContent
      );
      return textDocument;
    });

    this.setMany(textDocuments);
  }

  public mock(filePaths: string[] = []): MockTextDocuments {
    if (this.textDocuments.length === 0) {
      this.initMock(filePaths);
      return this;
    }

    // Don't add duplicate

    filePaths.forEach((path) => {
      const targetDocument = this.getAll().find((textDocument) => {
        return UriUtils.toSysPath(textDocument.uri) === path;
      });

      if (targetDocument) return;

      const newTextDocument = this.create(path);
      this.textDocuments.push(newTextDocument);
    });

    return this;
  }

  private convertToFileUris(
    options: { isUri?: boolean; isRelative?: boolean },
    fileUris: string[]
  ): string[] {
    if (options.isRelative === true) {
      fileUris = this.changeToRelative(fileUris);
    }
    if (options.isUri === true) {
      fileUris = this.convertToFileUri(fileUris);
    }
    return fileUris;
  }

  private changeToRelative(fileUris: string[]) {
    fileUris = fileUris.map((uri) => {
      const absPath = nodePath.resolve(this.workspaceRootUri, uri);
      return absPath;
    });
    return fileUris;
  }

  private convertToFileUri(filePaths: string[]) {
    const fileUris = filePaths.map((uri) => {
      let convertToUri = `file:/${uri}`;
      if (UriUtils.isWin()) {
        convertToUri = UriUtils.toVscodeUri(uri);
      }

      return convertToUri;
    });
    return fileUris;
  }
}
