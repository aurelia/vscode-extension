import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

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
