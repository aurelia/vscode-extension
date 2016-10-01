import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax', () => {

  test('must tokenize show attribute with scope "show.attribute.html.au"', () => {

    // arrange
    let scope = 'show.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
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

});
