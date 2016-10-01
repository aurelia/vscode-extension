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

});
