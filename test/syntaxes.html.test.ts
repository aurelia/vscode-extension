import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

let reg = require(path.join(require.main.filename, '../../node_modules/vscode-textmate/release/main.js')).Registry;

// arrange
let registry: vscodeTextmate.Registry = new reg();
registry.loadGrammarFromPathSync('C:/Repository-Erik/Aurelia/vscode-extension/syntaxes/html.json');
let grammar = registry.grammarForScopeName("au.html");

suite('The Aurelia HTML syntax', () => {

  test('must tokenize compose start element with scope "compose.html.au"', () => {

    // arrange
    let scope = 'compose.html.au';

    // act
    let lineToken = tokenizeLine('<compose>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 8);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize compose end element with scope "compose.html.au"', () => {

    // arrange
    let scope = 'compose.html.au';

    // act
    let lineToken = tokenizeLine('</compose>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 9);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize (repeat).for attribute with scope "repeat.attribute.html.au"', () => {

    // arrange
    let scope = 'repeat.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div repeat.for="foo of foos">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 11);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize repeat.(for) attribute with scope "for.attribute.html.au"', () => {

    // arrange
    let scope = 'for.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div repeat.for="foo of foos">');

    // assert
    let token = getTokenOnCharRange(lineToken, 12, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize model attribute with scope "model.attribute.html.au"', () => {

    // arrange
    let scope = 'model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div model.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 10);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize view attribute with scope "view.attribute.html.au"', () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize controller attribute with scope "attribute.html.au"', () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if attribute with scope "if.attribute.html.au"', () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize naive-if attribute with scope "if.attribute.html.au"', () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show attribute with scope "show.attribute.html.au"', () => {

    // arrange
    let scope = 'show.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.bind with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 12);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.ony-way with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div if.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.two-way with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div if.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.one-time with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div if.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 16);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.bind with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div show.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 14);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.one-way with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div show.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 17);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.two-way with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div show.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 17);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.one-time with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div show.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize string interpolation in element with scope "meta.string.interpolation"', () => {

    // arrange
    let scope = 'meta.string.interpolation';

    // act
    let lineToken = tokenizeLine('<div>${foo}</div>');

    // assert
    let startToken = getTokenOnCharRange(lineToken, 5, 7);
    let middleToken = getTokenOnCharRange(lineToken, 7, 10);
    let endToken = getTokenOnCharRange(lineToken, 10, 11);

    assert.equal(hasScope(startToken.scopes, scope), true);
    assert.equal(hasScope(middleToken.scopes, scope), true);
    assert.equal(hasScope(endToken.scopes, scope), true);

  });

  test('must tokenize string interpolation in element with scope "punctuation.definition.string.interpolation.start"', () => {

    // arrange
    let scope = 'punctuation.definition.string.interpolation.start';

    // act
    let lineToken = tokenizeLine('<div>${foo}</div>');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.equal(hasScope(token.scopes, 'punctuation.definition.string.interpolation.start'), true);

  });

  test('must tokenize string interpolation in element with scope "punctuation.definition.string.interpolation.end"', () => {

    // arrange
    let scope = 'punctuation.definition.string.interpolation.end';

    // act
    let lineToken = tokenizeLine('<div>${foo}</div>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 11);
    assert.equal(hasScope(token.scopes, 'punctuation.definition.string.interpolation.end'), true);

  });

  test('must tokenize string interpolation in attribute with scope "meta.string.interpolation"', () => {

    // arrange
    let scope = 'meta.string.interpolation';

    // act
    let lineToken = tokenizeLine('<div class="${foo}"></div>');

    // assert
    let startToken = getTokenOnCharRange(lineToken, 12, 14);
    let middleToken = getTokenOnCharRange(lineToken, 14, 17);
    let endToken = getTokenOnCharRange(lineToken, 17, 18);

    assert.equal(hasScope(startToken.scopes, scope), true);
    assert.equal(hasScope(middleToken.scopes, scope), true);
    assert.equal(hasScope(endToken.scopes, scope), true);

  });

  test('must tokenize string interpolation in attribute with scope "punctuation.definition.string.interpolation.start"', () => {

    // arrange
    let scope = 'punctuation.definition.string.interpolation.start';

    // act
    let lineToken = tokenizeLine('<div class="${foo}"></div>');

    // assert
    let token = getTokenOnCharRange(lineToken, 12, 14);
    assert.equal(hasScope(token.scopes, 'punctuation.definition.string.interpolation.start'), true);

  });

  test('must tokenize string interpolation in attribute with scope "punctuation.definition.string.interpolation.end"', () => {

    // arrange
    let scope = 'punctuation.definition.string.interpolation.end';

    // act
    let lineToken = tokenizeLine('<div class="${foo}"></div>');

    // assert
    let token = getTokenOnCharRange(lineToken, 17, 18);
    assert.equal(hasScope(token.scopes, 'punctuation.definition.string.interpolation.end'), true);

  });

  test('must tokenize string interpolation with condition with scope "meta.string.interpolation"', () => {

    // arrange
    let scope = 'meta.string.interpolation';

    // act
    let lineToken = tokenizeLine('${foo === true ? "a" : "b"}');

    // assert
    let startToken = getTokenOnCharRange(lineToken, 0, 2);
    let middleToken = getTokenOnCharRange(lineToken, 2, 26);
    let endToken = getTokenOnCharRange(lineToken, 26, 27);

    assert.equal(hasScope(startToken.scopes, scope), true);
    assert.equal(hasScope(middleToken.scopes, scope), true);
    assert.equal(hasScope(endToken.scopes, scope), true);

  });

  test('must tokenize string interpolation with condition with scope "punctuation.definition.string.interpolation.start"', () => {

    // arrange
    let scope = 'punctuation.definition.string.interpolation.start';

    // act
    let lineToken = tokenizeLine('${foo === true ? "a" : "b"}');

    // assert
    let token = getTokenOnCharRange(lineToken, 0, 2);
    assert.equal(hasScope(token.scopes, scope), true);

  });  

  test('must tokenize string interpolation with condition with scope "punctuation.definition.string.interpolation.end"', () => {

    // arrange
    let scope = 'meta.string.interpolation';

    // act
    let lineToken = tokenizeLine('${foo === true ? "a" : "b"}');

    // assert
    let token = getTokenOnCharRange(lineToken, 26, 27);
    assert.equal(hasScope(token.scopes, scope), true);

  });

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

  test('must tokenize bindable attribute with scope "bindable.attribute.html.au"', () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template bindable="greeting,name">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
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
