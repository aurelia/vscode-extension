import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';
// eslint-disable-next-line import/no-extraneous-dependencies
import { suite, test } from 'mocha';

interface ExpectedResult {
  label: string;
  expectedNames: string[];
}

suite('Completion In View', () => {
  const docUri = getDocUri('src/aurelia-components/autocomplete-in-view/autocomplete-in-view.html');

  /** Custom Element: my-compo */
  test('(hmtMmuEY) Should have completion for custom elements', async () => {
    const position = new vscode.Position(5, 2);
    await testCompletion(docUri, position, {
      label: 'Custom Element: ',
      expectedNames: [
        'autocomplete-in-view',
        'compo-user',
        'my-compo',
      ]
    });
  });

  // View Model: string-bindable
  test('(aqwmpQ1H) Should have completion for bindables of `my-compo.ts`', async () => {
    const position = new vscode.Position(9, 12);
    await testCompletion(docUri, position, {
      label: 'View Model: ',
      expectedNames: [
        'string-bindable',
        'number-bindable',
        'string-array-bindable',
        'inter-bindable',
      ]
    });
  });

  test('(Iku78qwA) Should have completion for `autocomplete-in-view.ts` methods', async () => {
    const position = new vscode.Position(21, 4);
    await testCompletion(docUri, position, {
      label: 'View Model: ',
      expectedNames: [
        'completeMe',
        'numberCompleteMe',
      ]
    });
  });
});

async function testCompletion(
  docUri: vscode.Uri,
  position: vscode.Position,
  expectedResult: ExpectedResult
) {
  await activate(docUri);

  const { expectedNames, label } = expectedResult;
  const completionListResult = await vscode.commands.executeCommand<vscode.CompletionList>(
    'vscode.executeCompletionItemProvider',
    docUri,
    position,
  );

  const matchingResults = completionListResult.items.filter(completionItem => {
    return completionItem.label.includes(label);
  });

  matchingResults.forEach(matchingItem => {
    const isMatch = expectedNames.find(expectedName => {
      return matchingItem.label === `${label}${expectedName}`;
    }) !== undefined;
    assert.strictEqual(isMatch, true);
  });
}
