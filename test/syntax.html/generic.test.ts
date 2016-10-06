import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax', () => {

  it('must tokenize element with dash with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('<any-element>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize closing element with dash with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('</any-element>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize element with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('<anyelement>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize closing element with scope "entity.name.tag.other.html"', () => {

    // arrange
    let scope = 'entity.name.tag.other.html';

    // act
    let lineToken = tokenizeLine('</anyelement>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
