import { Connection, RequestType } from 'vscode-languageserver';
import { GetEditorSelectionResponse } from '../types/types';
import {
  DocumentUri,
  OptionalVersionedTextDocumentIdentifier,
  Position,
  Range,
} from 'vscode-languageserver';
import {
  WorkspaceChange,
  ApplyWorkspaceEditResponse,
} from 'vscode-languageserver-protocol';
import { connection } from '../../server';

export async function getEditorSelection(connection: Connection) {
  const req = new RequestType('get-editer-selections');
  const getEditorResponse = (await connection.sendRequest(
    req
  )) as GetEditorSelectionResponse;
  return getEditorResponse;
}

/**
 * from https://stackoverflow.com/questions/57787621/how-to-create-and-edit-a-new-file-in-the-workspace-via-language-server-extension
 */
export class WorkspaceUpdates {
  private _wschanges: WorkspaceChange;

  constructor() {
    this._wschanges = new WorkspaceChange();
  }

  hasChanges(): boolean {
    return (
      this._wschanges.edit.changes != undefined ||
      this._wschanges.edit.documentChanges != undefined
    );
  }

  createFile(uri: DocumentUri, contents: string, overwrite = false) {
    this._wschanges.createFile(uri, { overwrite: overwrite });
    const edit = this._wschanges.edit;
    const change = this._wschanges.getTextEditChange(
      OptionalVersionedTextDocumentIdentifier.create(uri, null)
    );
    this.insertText(uri, contents, 0, 0);
  }

  renameFile(uri: DocumentUri, newUri: DocumentUri, overwrite: boolean) {
    this._wschanges.renameFile(uri, newUri, { overwrite: overwrite });
  }

  deleteFileFolder(
    uri: DocumentUri,
    recursive: boolean,
    ignoreIfNotExists: boolean
  ) {
    this._wschanges.deleteFile(uri, {
      recursive: recursive,
      ignoreIfNotExists: ignoreIfNotExists,
    });
  }

  insertText(uri: DocumentUri, contents: string, line: number, column: number) {
    const change = this._wschanges.getTextEditChange(
      OptionalVersionedTextDocumentIdentifier.create(uri, null)
    );
    change.insert(Position.create(line, column), contents);
  }

  replaceText(
    uri: DocumentUri,
    replaceWith: string,
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number
  ) {
    const change = this._wschanges.getTextEditChange(
      OptionalVersionedTextDocumentIdentifier.create(uri, null)
    );
    change.replace(
      Range.create(
        Position.create(startLine, startColumn),
        Position.create(endLine, endColumn)
      ),
      replaceWith
    );
  }

  replaceAllText(uri: DocumentUri, contents: string) {
    this.replaceText(uri, contents, 0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
  }

  deleteText(
    uri: DocumentUri,
    contents: string,
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number
  ) {
    const change = this._wschanges.getTextEditChange(
      OptionalVersionedTextDocumentIdentifier.create(uri, null)
    );
    change.delete(
      Range.create(
        Position.create(startLine, startColumn),
        Position.create(endLine, endColumn)
      )
    );
  }

  async applyChanges(): Promise<ApplyWorkspaceEditResponse> {
    return connection.workspace.applyEdit(this._wschanges.edit);
  }
}
