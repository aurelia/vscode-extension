import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax view attribute', () => {

  test('must tokenize view attribute with scope "view.attribute.html.au"', () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
