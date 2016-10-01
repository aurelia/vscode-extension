import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax', () => {

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

});
