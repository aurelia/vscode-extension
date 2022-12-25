import { RequestType } from 'vscode-languageserver';
import { ConnectionType } from '../../server';

export async function initExtractComponent(connection: ConnectionType) {
  await getComponentName(connection);
}

async function getComponentName(connection: ConnectionType) {
  const req = new RequestType('get-component-name')
  connection.sendRequest(req);
  // connection.sendRequest('get-component-name');
}
