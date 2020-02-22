import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

describe('Should go to definition', () => {
  const docUri = getDocUri('src/aurelia-components/hello-world.html');

  it('From View: Go to view model definition', async () => {
    const position = new vscode.Position(5, 34);
    await testCompletion(docUri, position, [7, 9, 7, 54]);

    const position2 = new vscode.Position(8, 34);
    await testCompletion(docUri, position2, [4, 12, 4, 54]);
  });
});

async function testCompletion(
  docUri: vscode.Uri,
  position: vscode.Position,
  expectedLocation: number[],
) {
  await activate(docUri);

  const definitionLocation = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    position
  )) as vscode.Location[];

  assert.equal(definitionLocation[0].range.start.line, expectedLocation[0]);
  assert.equal(definitionLocation[0].range.start.character, expectedLocation[1]);
  assert.equal(definitionLocation[0].range.end.line, expectedLocation[2]);
  assert.equal(definitionLocation[0].range.end.character, expectedLocation[3]); // Why 54? Because in `hello-world.ts`, the end line should be 41ish
}
