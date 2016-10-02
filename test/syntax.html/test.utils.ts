import * as path from 'path';

// tslint:disable
let Registry = require(path.join(require.main.filename, '../../node_modules/vscode-textmate/release/main.js')).Registry;
// tslint:enable
let registry: vscodeTextmate.Registry = new Registry();
registry.loadGrammarFromPathSync('C:/Repository-Erik/Aurelia/vscode-extension/syntaxes/html.json');
let grammar = registry.grammarForScopeName('au.html');

export function tokenizeLine(line: string) {
  return grammar.tokenizeLine(line, undefined);
}

export function getTokenOnCharRange(
  lineToken: vscodeTextmate.ITokenizeLineResult,
  startIndex: number,
  endIndex: number) {

  let tokens = lineToken.tokens.filter(token => token.startIndex === startIndex && token.endIndex === endIndex);
  return tokens.length === 1 ? tokens[0] : null;
}

export function hasScope(scopes: Array<string>, scope: string) {
  let foundScopes = scopes.filter(s => s === scope);
  return foundScopes.length === 1;
}
