import * as fs from 'fs';
import { parseRawGrammar, Registry } from 'vscode-textmate';

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => error ? reject(error) : resolve(data));
  });
}

const registry = new Registry({
  loadGrammar: (scopeName) => {
    if (scopeName === 'au.html') {
      return readFile('./syntaxes/html.json').then((data: string) => {
        return parseRawGrammar(data, './syntaxes/html.json');
      });
    }
    return null;
  },
});

export async function tokenizeLine(line: string) {
  const grammar = await registry.loadGrammar('au.html');
  return grammar.tokenizeLine(line, undefined);
}

export function getTokenOnCharRange(
  lineToken,
  startIndex: number,
  endIndex: number) {

  const tokens = lineToken.tokens.filter((token) => token.startIndex === startIndex && token.endIndex === endIndex);
  return tokens.length === 1 ? tokens[0] : null;
}

export function hasScope(scopes: string[], scope: string) {
  const foundScopes = scopes.filter((s) => s === scope);
  return foundScopes.length === 1;
}

export function writeOut(lineToken, text) {
  for (const lt of lineToken.tokens) {
    // tslint:disable-next-line:no-console
    console.log(`${lt.startIndex} - ${lt.endIndex} => ${text.substring(lt.startIndex, lt.endIndex)}`);
    for (const s of lt.scopes) {
      // tslint:disable-next-line:no-console
      console.log(`- ${s}`);
    }
  }
}
