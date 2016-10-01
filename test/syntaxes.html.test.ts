import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

let reg = require(path.join(require.main.filename, '../../node_modules/vscode-textmate/release/main.js')).Registry;

// arrange
let registry: vscodeTextmate.Registry = new reg();
registry.loadGrammarFromPathSync('C:/Repository-Erik/Aurelia/vscode-extension/syntaxes/html.json');
let grammar = registry.grammarForScopeName("au.html");

suite('The Aurelia HTML syntax', () => {

  test('must tokenize element with dash with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('<any-element>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 12);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize closing element with dash with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('</any-element>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 13);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize element with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('<anyelement>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 11);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize closing element with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('</anyelement>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 12);
    assert.equal(hasScope(token.scopes, scope), true);

  });
  
});

function tokenizeLine(line: string) {
  return grammar.tokenizeLine(line, undefined);
}

function getTokenOnCharRange(lineToken: vscodeTextmate.ITokenizeLineResult, startIndex: number, endIndex: number) {
  let tokens = lineToken.tokens.filter(token => token.startIndex === startIndex && token.endIndex == endIndex);
  return tokens.length === 1 ? tokens[0] : null;
}

function hasScope(scopes: Array<string>, scope: string) {
  let foundScopes = scopes.filter(s => s === scope);
  return foundScopes.length === 1;
}
