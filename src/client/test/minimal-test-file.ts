import * as vscode from 'vscode';
import * as assert from 'assert';
import * as path from 'path';
import { getDocUri, activate } from './helper';

describe('Minimal Setup', () => {
  const docUri = getDocUri('path/to/component');

  it('Should be minimal', async () => {

  });
});

async function testCompletion(
  docUri: vscode.Uri,
  position: vscode.Position,
) {
  await activate(docUri);

  const definitionLocation = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    position
  )) as vscode.Location[];
}
