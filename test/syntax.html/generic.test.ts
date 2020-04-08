import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax', () => {

  it('must tokenize element with dash with scope "entity.name.tag.other.html"', async () => {

    // arrange
    const scope = 'entity.name.tag.other.html';

    // act
    const lineToken = await tokenizeLine('<any-element>');

    // assert
    const token = getTokenOnCharRange(lineToken, 1, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize closing element with dash with scope "entity.name.tag.other.html"', async () => {

    // arrange
    const scope = 'entity.name.tag.other.html';

    // act
    const lineToken = await tokenizeLine('</any-element>');

    // assert
    const token = getTokenOnCharRange(lineToken, 2, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize element with scope "entity.name.tag.other.html"', async () => {

    // arrange
    const scope = 'entity.name.tag.other.html';

    // act
    const lineToken = await tokenizeLine('<anyelement>');

    // assert
    const token = getTokenOnCharRange(lineToken, 1, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize closing element with scope "entity.name.tag.other.html"', async () => {

    // arrange
    const scope = 'entity.name.tag.other.html';

    // act
    const lineToken = await tokenizeLine('</anyelement>');

    // assert
    const token = getTokenOnCharRange(lineToken, 2, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize inline element with dash as scope "entity.name.tag.other.html"', async () => {

    // arrange
    const scope = 'entity.name.tag.other.html';

    // act
    const lineToken = await tokenizeLine('<input-type>');

    // assert
    const token = getTokenOnCharRange(lineToken, 1, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize block element with dash as scope "entity.name.tag.other.html"', async () => {

    // arrange
    const scope = 'entity.name.tag.other.html';

    // act
    const lineToken = await tokenizeLine('<aside-type>');

    // assert
    const token = getTokenOnCharRange(lineToken, 1, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
