import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax string interpolation', () => {

  it('must tokenize string interpolation in element with scope correct scopes', async () => {

    // act
    const lineToken = await tokenizeLine('<div>${foo}</div>');

    // assert
    const startToken = getTokenOnCharRange(lineToken, 5, 7);
    const middleToken = getTokenOnCharRange(lineToken, 7, 10);
    const endToken = getTokenOnCharRange(lineToken, 10, 11);

    assert.isOk(hasScope(startToken.scopes, 'punctuation.definition.string.interpolation.start'));
    assert.isOk(hasScope(middleToken.scopes, 'meta.string.interpolation'));
    assert.isOk(hasScope(endToken.scopes, 'punctuation.definition.string.interpolation.end'));

  });

  it('must tokenize string interpolation in element with scope "punctuation.definition.string.interpolation.start"', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.start';

    // act
    const lineToken = await tokenizeLine('<div>${foo}</div>');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize string interpolation in element with scope "punctuation.definition.string.interpolation.end"', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.end';

    // act
    const lineToken = await tokenizeLine('<div>${foo}</div>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize string interpolation in attribute with correct scopes', async () => {

    // act
    const lineToken = await tokenizeLine('<div class="${foo}"></div>');

    // assert
    const startToken = getTokenOnCharRange(lineToken, 12, 14);
    const middleToken = getTokenOnCharRange(lineToken, 14, 17);
    const endToken = getTokenOnCharRange(lineToken, 17, 18);

    assert.isOk(hasScope(startToken.scopes, 'punctuation.definition.string.interpolation.start'));
    assert.isOk(hasScope(middleToken.scopes, 'meta.string.interpolation'));
    assert.isOk(hasScope(endToken.scopes, 'punctuation.definition.string.interpolation.end'));

  });

  it('must tokenize string interpolation in attribute with scope "punctuation.definition.string.interpolation.start"', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.start';

    // act
    const lineToken = await tokenizeLine('<div class="${foo}"></div>');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 14);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize string interpolation in attribute with scope "punctuation.definition.string.interpolation.end"', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.end';

    // act
    const lineToken = await tokenizeLine('<div class="${foo}"></div>');

    // assert
    const token = getTokenOnCharRange(lineToken, 17, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize string interpolation with condition with correct scopes', async () => {

    // act
    const lineToken = await tokenizeLine('${foo === true ? "a" : "b"}');

    // assert
    const startToken = getTokenOnCharRange(lineToken, 0, 2);
    const middleToken = getTokenOnCharRange(lineToken, 2, 26);
    const endToken = getTokenOnCharRange(lineToken, 26, 27);

    assert.isOk(hasScope(startToken.scopes, 'punctuation.definition.string.interpolation.start'));
    assert.isOk(hasScope(middleToken.scopes, 'meta.string.interpolation'));
    assert.isOk(hasScope(endToken.scopes, 'punctuation.definition.string.interpolation.end'));

  });

  it('must tokenize string interpolation with condition with scope "punctuation.definition.string.interpolation.start"', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.start';

    // act
    const lineToken = await tokenizeLine('${foo === true ? "a" : "b"}');

    // assert
    const token = getTokenOnCharRange(lineToken, 0, 2);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize string interpolation with condition with scope "punctuation.definition.string.interpolation.end"', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.end';

    // act
    const lineToken = await tokenizeLine('${foo === true ? "a" : "b"}');

    // assert
    const token = getTokenOnCharRange(lineToken, 26, 27);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize only the last } with the scope "punctuation.definition.string.interpolation.end", resolves issue #48', async () => {

    // arrange
    const scope = 'punctuation.definition.string.interpolation.end';

    // act
    const lineToken = await tokenizeLine('<span innerHTML="${\'foo\' & t: {a: \'/foo\'}}"></span>');

    // assert
    const closeToken = getTokenOnCharRange(lineToken, 41, 42);
    assert.isOk(hasScope(closeToken.scopes, scope));

    const tokenInText = getTokenOnCharRange(lineToken, 19, 41);
    assert.isNotOk(hasScope(tokenInText.scopes, scope));
  });

});
