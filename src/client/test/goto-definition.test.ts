import * as vscode from 'vscode';
import * as assert from 'assert';
import * as path from 'path';
import { getDocUri, activate } from './helper';
// eslint-disable-next-line import/no-extraneous-dependencies
import { suite, test } from 'mocha';

interface IExpectedResult {
  expectedLocation: number[];
  expectedFileName: string;
}

suite('Go To Definition', () => {
  const docUri = getDocUri('src/aurelia-components/compo-user.html');

  test('(xhdu5mWv) Should open`my-compo.ts` at eg. `public message: string;', async () => {
    const position = new vscode.Position(26, 34);
    await testCompletion(docUri, position, {
      expectedLocation: [8, 9, 8, 54],
      expectedFileName: 'compo-user.ts',
    });
  });

  test('(hEePRI08) Should open view model `compo-user.ts` at `class CompoUserCustomElement`', async () => {
    const position = new vscode.Position(30, 28);
    await testCompletion(docUri, position, {
      expectedLocation: [5, 12, 5, 54],
      expectedFileName: 'compo-user.ts',
    });
  });

  test('(uOE33Pqm) Should open view model of `my-compo.ts`', async () => {
    const position = new vscode.Position(7, 29);
    await testCompletion(docUri, position, {
      expectedLocation: [0, 0, 0, 6],
      expectedFileName: 'my-compo.ts',
    });
  });

  test('(EUmcjqaIO) Should open view model of `my-compo.ts`', async () => {
    const position = new vscode.Position(19, 14);
    await testCompletion(docUri, position, {
      expectedLocation: [0, 0, 0, 6],
      expectedFileName: 'my-compo.ts',
    });
  });

});

async function testCompletion(
  docUri: vscode.Uri,
  position: vscode.Position,
  expectedResult: IExpectedResult
) {
  await activate(docUri);
  const { expectedFileName, expectedLocation } = expectedResult;

  const definitionLocation = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    position
  ));

  const targetDefinition = definitionLocation[0];
  const { range, uri } = targetDefinition;

  assert.equal(range.start.line, expectedLocation[0]);
  assert.equal(range.start.character, expectedLocation[1]);
  assert.equal(range.end.line, expectedLocation[2]);
  assert.equal(range.end.character, expectedLocation[3]); // Why 54? Because in `hello-world.ts`, the end line should be 41ish

  assert.equal(path.basename(uri.path), expectedFileName);
}
