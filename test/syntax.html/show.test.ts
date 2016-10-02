import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax show attribute', () => {

  test('must tokenize show attribute with scope "show.attribute.html.au"', () => {

    // arrange
    let scope = 'show.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
