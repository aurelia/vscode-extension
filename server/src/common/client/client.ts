import { Connection, RequestType } from 'vscode-languageserver';
import { GetEditorSelectionResponse } from '../types/types';

export async function getEditorSelection(connection: Connection) {
  const req = new RequestType('get-editer-selections');
  const getEditorResponse = (await connection.sendRequest(
    req
  )) as GetEditorSelectionResponse;
  return getEditorResponse;
}
