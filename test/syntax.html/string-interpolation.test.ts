import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax string interpolation', () => {

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

});
